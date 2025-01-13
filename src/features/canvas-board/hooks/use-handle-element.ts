import { useCanvas } from "@/app/providers/CanvasProvider";
import { EnrichedElement, Tool } from "@/types";
import {  useCallback } from "react";
import { getDefaultShape } from "../utils/default-shape-definition";
import { useReplicache } from "@/app/providers/ReplicacheProvider";

export const useHandleElement = () => {

    const {clientElementsRef, setClientElementsRef, setGhostElementsRef} = useCanvas();
    const rep = useReplicache();
    const clientElements = clientElementsRef.current;

    const handleMoveElement = useCallback((x1: number, y1: number, element: EnrichedElement | null) => {
        if(!element) return;

        const newElements = [...clientElements ?? []]
        
        // Calculate new position based on original offset
        const newX1 = x1 - element.offsetX
        const newY1 = y1 - element.offsetY

        // Calculate new x2, y2 while maintaining the element's dimensions
        const width = element.position.x2 - element.position.x1;
        const height = element.position.y2 - element.position.y1;
        
        const newElement = {
            ...element,
            position: {
                x1: newX1,
                y1: newY1,
                x2: newX1 + width,
                y2: newY1 + height
            }
        };
        const findElementIndex = newElements.findIndex(el => el.id === element.id);
        if(findElementIndex === -1) newElements.push(newElement);
        else newElements.splice(findElementIndex, 1, newElement);
        setClientElementsRef(newElements);
    }, [clientElements, setClientElementsRef]);



    const handleGhostElement = useCallback((x1: number, y1: number, tool: Tool) => {
        const ghostElement = getDefaultShape(tool, x1, y1, 'ghost');
        if(ghostElement) setGhostElementsRef(ghostElement);
    }, [setGhostElementsRef]);



    const handleCreateElement = useCallback(async (x1: number, y1: number, tool: Tool) => {
        const defaultShape = getDefaultShape(tool, x1, y1,'create');
        if(!defaultShape) return 

        const newElements = [...clientElements ?? []]
        newElements.push(defaultShape);
        setClientElementsRef(newElements);
        await rep.mutate.create_element(defaultShape);
    }, [clientElements, setClientElementsRef, rep]);


    return {
        handleMoveElement,
        handleGhostElement,
        handleCreateElement
    }

}


