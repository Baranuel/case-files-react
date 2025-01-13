import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useRef, useMemo } from "react";
import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";
import { useReplicache } from "@/app/providers/ReplicacheProvider";
import { setCursor } from "../utils/cursor-state";

export const useCanvasEvents = () => {
    const rep = useReplicache();
    const {
        setSelectedItemId,
        tool,
        action,
        setAction,
        canvasRef,
        setTool,
        cameraRef,
        setGhostElementsRef,
        clientElementsRef
    } = useCanvas();
    
    const {
        handleMoveElement,
        handleGhostElement,
        handleCreateElement
    } = useHandleElement();

    // Refs
    const lastPositionRef = useRef<{x1: number, y1: number}>({x1: 0, y1: 0});
    const foundElementRef = useRef<EnrichedElement | null>(null);


    // Helper functions
    const handleSelectElementId = useCallback((element: EnrichedElement | null) => {
        if(element?.id.includes('ghost-element')) return;
        document.startViewTransition(() => {
            setSelectedItemId(element?.id ?? null);
        });
    }, [setSelectedItemId]);

    const handleMouseDown = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
        const camera = cameraRef.current;
        const clientElements = clientElementsRef.current;
        const canvas = canvasRef.current;
        if(!camera || !clientElements || !canvas) return;
        const {x1, y1} = getMouseCoordinates(e, camera);
        lastPositionRef.current = {x1, y1};
        
        if(tool !== 'select') {
            await handleCreateElement(x1, y1, tool);
            return;
        }
        
        const element = getElementAtPosition(x1, y1, clientElements);
        
        foundElementRef.current = element;
        const action = handleInferAction(element?.positionWithinElement ?? null, tool);
        setAction(action);
        setCursor(canvas, tool, action, element);
    }, [cameraRef, clientElementsRef, tool, setAction, handleCreateElement]);

    const handleMouseUp = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
        const camera = cameraRef.current;
        const clientElements = clientElementsRef.current;
        const canvas = canvasRef.current;
        if(!camera || !clientElements || !canvas) return;
        
        const {x1, y1} = getMouseCoordinates(e, camera);
        const element = getElementAtPosition(x1, y1, clientElements);

        const lastPos = lastPositionRef.current;
        const isSamePosition = Math.abs(x1 - lastPos.x1) < 5 && Math.abs(y1 - lastPos.y1) < 5;
        
        if(isSamePosition) {
            handleSelectElementId(foundElementRef.current);
        }

        if(action === 'moving') {
            const foundElement = foundElementRef.current;
            const lastInteractionElement = clientElements?.find(el => el.id === foundElement?.id);
            await rep.mutate.update_element(lastInteractionElement) // element that we moved 
        }



        lastPositionRef.current = {x1: 0, y1: 0};
        foundElementRef.current = null;
        setAction(null);
        setTool('select');
        setGhostElementsRef(null);
        setCursor(canvas, tool, action,element);
    }, [cameraRef, setAction, handleSelectElementId, setTool, setGhostElementsRef, rep, clientElementsRef]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const camera = cameraRef.current;
        const clientElements = clientElementsRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !camera || !clientElements) return;

        const {x1, y1} = getMouseCoordinates(e, camera);
        const element = getElementAtPosition(x1, y1, clientElements);

        setCursor(canvas, tool, action, element);

        if(tool !== 'select') {
            requestAnimationFrame(() => handleGhostElement(x1, y1, tool));
        }

        if(action === 'moving' && foundElementRef.current) {
            requestAnimationFrame(() => handleMoveElement(x1, y1, foundElementRef.current));
        }

    }, [cameraRef, action, handleMoveElement, canvasRef, handleGhostElement, tool, clientElementsRef]);

    const handleMouseLeave = useCallback(() => {
        setGhostElementsRef(null);
    }, [setGhostElementsRef]);

    // Return memoized event handlers
    return useMemo(() => ({
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave
    }), [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave]);
}
