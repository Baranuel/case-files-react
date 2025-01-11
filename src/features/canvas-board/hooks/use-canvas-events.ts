import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useEffect, useRef, useState } from "react";

import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";


export const useCanvasEvents = () => {
    
    const {setSelectedItemId,tool, visibleElements, camera, action, setAction, canvasRef, setVisibleElements, setTool} = useCanvas();
    const {handleMoveElement, handleGhostElement, handleCreateElement} = useHandleElement();
    const [lastPosition, setLastPosition] = useState<{x1: number, y1: number}>({x1: 0, y1: 0});
    const [foundElement, setFoundElement] = useState<EnrichedElement | null>(null);

    const handleSelectElementId = useCallback((element: EnrichedElement | null) => {
        if(element?.id.includes('ghost-element')) return;
        document.startViewTransition(() => {
            setSelectedItemId(element?.id ?? null);
        });
    }, [setSelectedItemId]);


    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const {x1, y1} = getMouseCoordinates(e, camera);
        setLastPosition({x1, y1});

        if(tool !== 'select') {
            handleCreateElement(x1, y1, tool);
        }
        
        const element = getElementAtPosition(x1, y1, visibleElements);
        if(!element) return;
        setFoundElement(element);

        const action = handleInferAction(element.positionWithinElement, tool);
        setAction(action);

    }, [camera, visibleElements, tool, setAction, setFoundElement, setLastPosition, setVisibleElements]);


    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const {x1, y1} = getMouseCoordinates(e, camera);
        const isSamePosition = Math.abs(x1 - lastPosition.x1) < 5 && Math.abs(y1 - lastPosition.y1) < 5;
        if(isSamePosition) handleSelectElementId(foundElement);

        setAction(null);
        setFoundElement(null);
        setLastPosition({x1: 0, y1: 0});
        setTool('select');
        setVisibleElements(p => p.filter(el => !el.id.includes('ghost-element')));
    }, [camera, setAction, handleSelectElementId, lastPosition, foundElement, setFoundElement, setLastPosition, setVisibleElements]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const {x1, y1} = getMouseCoordinates(e, camera);

        if(action === 'moving' && foundElement) requestAnimationFrame(() => handleMoveElement(x1, y1, foundElement));
        handleGhostElement(x1, y1, tool);
    }, [camera, action, handleMoveElement, canvasRef, foundElement, handleGhostElement, tool, visibleElements]);


    const handleMouseLeave = useCallback(() => {
        setVisibleElements(p => p.filter(el => !el.id.includes('ghost-element')));
    }, [setVisibleElements]);


   

    return {
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave
    }

}
