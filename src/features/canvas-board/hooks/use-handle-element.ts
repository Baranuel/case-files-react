import { useCanvas } from "@/app/providers/CanvasProvider";
import { EnrichedElement, Tool } from "@/types";
import {  useCallback } from "react";
import { getDefaultShape } from "../utils/default-shape-definition";

export const useHandleElement = () => {

    const {visibleElements, setVisibleElements, selectedItemId} = useCanvas();

    const handleMoveElement = useCallback((x1: number, y1: number, element: EnrichedElement | null) => {
        if(!element) return;

        const newElements = [...visibleElements];
        const findElement = element;
        
        // Calculate new position based on original offset
        const newX1 = x1 - findElement.offsetX
        const newY1 = y1 - findElement.offsetY

        // Calculate new x2, y2 while maintaining the element's dimensions
        const width = findElement.position.x2 - findElement.position.x1;
        const height = findElement.position.y2 - findElement.position.y1;
        
        const newElement = {
            ...findElement,
            position: {
                x1: newX1,
                y1: newY1,
                x2: newX1 + width,
                y2: newY1 + height
            }
        };
        const findElementIndex = visibleElements.findIndex(el => el.id === findElement.id);
        newElements.splice(findElementIndex, 1, newElement);
        setVisibleElements(newElements);
    }, [visibleElements, setVisibleElements, selectedItemId]);



    const handleGhostElement = useCallback((x1: number, y1: number, tool: Tool) => {
        const ghostElement = getDefaultShape(tool, x1, y1, 'ghost');
        if(tool === 'select') return setVisibleElements(p => p.filter(el => !el.id.includes('ghost-element')));
        if(ghostElement)  {
            const newElements = [...visibleElements];
            const ghostElementIndex = newElements.findIndex(el => el.id === ghostElement.id);
            if(ghostElementIndex === -1) newElements.push(ghostElement);
            else newElements.splice(ghostElementIndex, 1, ghostElement);
            setVisibleElements(newElements);
        }
    }, [visibleElements, setVisibleElements]);



    const handleCreateElement = useCallback((x1: number, y1: number, tool: Tool) => {
        const defaultShape = getDefaultShape(tool, x1, y1,'create');
        if(!defaultShape) return 

        const newElements = [...visibleElements];
        const findElementIndex = newElements.findIndex(el => el.id === defaultShape.id);
        if(findElementIndex === -1) newElements.push(defaultShape);
        else newElements.splice(findElementIndex, 1, defaultShape);
        setVisibleElements(newElements);

    }, [visibleElements, setVisibleElements]);


    return {
        handleMoveElement,
        handleGhostElement,
        handleCreateElement
    }

}


