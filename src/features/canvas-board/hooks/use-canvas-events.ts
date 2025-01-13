import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useRef, useMemo } from "react";

import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";


export const useCanvasEvents = () => {
    
    const {setSelectedItemId,tool, action, setAction, canvasRef, setTool, cameraRef,setGhostElementsRef, visibleElements} = useCanvas();
    const {handleMoveElement, handleGhostElement, handleCreateElement} = useHandleElement();
    
    const lastPositionRef = useRef<{x1: number, y1: number}>({x1: 0, y1: 0});
    const foundElementRef = useRef<EnrichedElement | null>(null);

    const camera = cameraRef.current;
    const canvas = canvasRef.current;

    const handleSelectElementId = useCallback((element: EnrichedElement | null) => {
        if(element?.id.includes('ghost-element')) return;
        document.startViewTransition(() => {
            setSelectedItemId(element?.id ?? null);
        });
    }, [setSelectedItemId]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!camera) return;
        const {x1, y1} = getMouseCoordinates(e, camera);
        lastPositionRef.current = {x1, y1};

        if(tool !== 'select') handleCreateElement(x1, y1, tool)
        
        const element = getElementAtPosition(x1, y1, visibleElements);
        if(!element) return;
        foundElementRef.current = element;

        const action = handleInferAction(element.positionWithinElement, tool);
        setAction(action);

    }, [camera, visibleElements, tool, setAction, handleCreateElement]);

    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!camera) return;
        const {x1, y1} = getMouseCoordinates(e, camera);
        const lastPos = lastPositionRef.current;
        const isSamePosition = Math.abs(x1 - lastPos.x1) < 5 && Math.abs(y1 - lastPos.y1) < 5;
        
        if(isSamePosition) handleSelectElementId(foundElementRef.current);

        foundElementRef.current = null;
        lastPositionRef.current = {x1: 0, y1: 0};

        setAction(null);
        setTool('select');
        setGhostElementsRef(null);
    }, [camera, setAction, handleSelectElementId, setTool, setGhostElementsRef]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvas || !camera) return;
        const {x1, y1} = getMouseCoordinates(e, camera);
        if(tool !== 'select') requestAnimationFrame(() => handleGhostElement(x1, y1, tool));

        if(action === 'moving' && foundElementRef.current) {
            requestAnimationFrame(() => handleMoveElement(x1, y1, foundElementRef.current));
        }
    }, [camera, action, handleMoveElement, canvasRef, handleGhostElement, tool]);

    const handleMouseLeave = useCallback(() => {
        setGhostElementsRef(null);
    }, [setGhostElementsRef]);

    return useMemo(() => ({
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave
    }), [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave]);
}
