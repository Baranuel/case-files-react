import { useCanvas } from "@/app/providers/CanvasProvider";
import { EnrichedElement, Tool } from "@/types";
import {  useCallback } from "react";
import { getDefaultShape } from "../utils/default-shape-definition";
import { resizedCoordinates } from "../utils/positions";
import { useParams } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";

export const useHandleElement = () => {

    const {clientViewRef, setClientViewRef} = useCanvas();
    const {boardId} = useParams({strict:false})
    const {userId} = useAuth() 

    const handleMoveElement = useCallback((x1: number, y1: number, element: EnrichedElement | null) => {
        const clientView = clientViewRef.current;
        if(!clientView || !element) return;

        const {elements} = clientView;

        const newElements = [...elements ?? []]
        
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
        setClientViewRef(prev => ({...prev, elements: newElements}));
    }, [clientViewRef, setClientViewRef]);



    const handleGhostElement = useCallback((x1: number, y1: number, tool: Tool) => {
        const ghostElement = getDefaultShape(tool, x1, y1, 'ghost', userId!, boardId );
        if(ghostElement) setClientViewRef(prev => ({...prev, ghostElement}));
    }, [setClientViewRef]);



    const handleCreateElement = useCallback((x1: number, y1: number, tool: Tool) => {
        const clientView = clientViewRef.current;
        if(!clientView) return;
        const {elements} = clientView;
        const defaultShape = getDefaultShape(tool, x1, y1,'create',userId!, boardId);
        if(!defaultShape) return 

        const newElements = [...elements ?? []]
        newElements.push(defaultShape);
        setClientViewRef(prev => ({...prev, elements: newElements}));

        return defaultShape;
    }, [clientViewRef, setClientViewRef]);


    const handleDrawElement = useCallback((x1: number, y1: number, drawnElement: EnrichedElement) => {
        const clientView = clientViewRef.current;
        if(!clientView) return;
        const {elements} = clientView;
        const newElements = [...elements ?? []]

        const updatedElement = {
            ...drawnElement,
            position: {
                x1: drawnElement.position.x1,
                y1: drawnElement.position.y1,
                x2: x1,
                y2: y1
            }
        }
        const findElementIndex = newElements.findIndex(el => el.id === drawnElement.id);
        if(findElementIndex === -1) newElements.push(updatedElement);
        else newElements.splice(findElementIndex, 1, updatedElement);
        setClientViewRef(prev => ({...prev, elements: newElements}));
    }, [clientViewRef, setClientViewRef]);



    const handleResizeElement = useCallback((mouseX: number, mouseY: number, element: EnrichedElement) => {
        const clientView = clientViewRef.current;
        if(!clientView) return;
        const {positionWithinElement, position} = element;
        const {elements} = clientView;

        const coordinates = resizedCoordinates(mouseX, mouseY, positionWithinElement, position);
        if(!coordinates) return;

        const newElements = [...elements ?? []]
        const findElementIndex = newElements.findIndex(el => el.id === element.id);

        const newElement = {
            ...element,
            position: coordinates
        };
        if(findElementIndex === -1) newElements.push(newElement);
        else newElements.splice(findElementIndex, 1, newElement);
        setClientViewRef(prev => ({...prev, elements: newElements}));



    }, [clientViewRef, setClientViewRef]);

    return {
        handleMoveElement,
        handleGhostElement,
        handleCreateElement,
        handleDrawElement,
        handleResizeElement
    }

}


