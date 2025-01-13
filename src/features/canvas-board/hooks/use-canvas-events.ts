import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useRef, useMemo } from "react";

import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";


export const useCanvasEvents = () => {
    
    const {setSelectedItemId,tool, visibleElements, camera, action, setAction, canvasRef, setVisibleElements, setTool} = useCanvas();
    const {handleMoveElement, handleGhostElement, handleCreateElement} = useHandleElement();
    
    const lastPositionRef = useRef<{x1: number, y1: number}>({x1: 0, y1: 0});
    const foundElementRef = useRef<EnrichedElement | null>(null);
    

    const handleSelectElementId = useCallback((element: EnrichedElement | null) => {
        if(element?.id.includes('ghost-element')) return;
        document.startViewTransition(() => {
            setSelectedItemId(element?.id ?? null);
        });
    }, [setSelectedItemId]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const {x1, y1} = getMouseCoordinates(e, camera);
        lastPositionRef.current = {x1, y1};

        if(tool !== 'select') handleCreateElement(x1, y1, tool)
        
        const element = getElementAtPosition(x1, y1, visibleElements);
        console.log(x1,y1)
        if(!element) return;
        console.log(element)
        foundElementRef.current = element;

        const action = handleInferAction(element.positionWithinElement, tool);
        setAction(action);

    }, [camera, visibleElements, tool, setAction, handleCreateElement]);

    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const {x1, y1} = getMouseCoordinates(e, camera);
        const lastPos = lastPositionRef.current;
        const isSamePosition = Math.abs(x1 - lastPos.x1) < 5 && Math.abs(y1 - lastPos.y1) < 5;
        
        if(isSamePosition) handleSelectElementId(foundElementRef.current);

        foundElementRef.current = null;
        lastPositionRef.current = {x1: 0, y1: 0};

        setAction(null);
        setTool('select');
        setVisibleElements(prev => prev.filter(el => !el.id.includes('ghost-element')));
    }, [camera, setAction, handleSelectElementId, setTool, setVisibleElements]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const {x1, y1} = getMouseCoordinates(e, camera);
        if(tool !== 'select') requestAnimationFrame(() => handleGhostElement(x1, y1, tool));

        if(action === 'moving' && foundElementRef.current) {
            requestAnimationFrame(() => handleMoveElement(x1, y1, foundElementRef.current));
        }
    }, [camera, action, handleMoveElement, canvasRef, handleGhostElement, tool]);

    const handleMouseLeave = useCallback(() => {
        setVisibleElements(prev => prev.filter(el => !el.id.includes('ghost-element')));
    }, [setVisibleElements]);

    return useMemo(() => ({
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave
    }), [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave]);
}
