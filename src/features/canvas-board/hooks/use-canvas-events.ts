import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useMemo, useState } from "react";
import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";
import { useReplicache } from "@/app/providers/ReplicacheProvider";
import { setCursor } from "../utils/cursor-state";

export const useCanvasEvents = () => {
    const rep = useReplicache();
    const {
        clientViewRef,
        tool,
        action,
        setAction,
        canvasRef,
        setTool,
        setClientViewRef,
        setPreviewElementId
    } = useCanvas();
    
    const {
        handleMoveElement,
        handleGhostElement,
        handleCreateElement,
        handleDrawElement,
        handleResizeElement
    } = useHandleElement();


    const handleSelectElementId = useCallback((element: EnrichedElement | null) => {
        if(element?.id.includes('ghost-element')) return;
        document.startViewTransition(() => {
            setPreviewElementId(element?.id ?? null);
        });
    }, [setPreviewElementId]);

    const handleMouseDown = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
        const clientView = clientViewRef.current;
        const canvas = canvasRef.current;
        if(!clientView || !canvas) return;
        const {camera, elements} = clientView;
        const {x1, y1} = getMouseCoordinates(e, camera);
        setClientViewRef(prev => ({...prev, lastClickedPosition: {x1, y1}}));
        
        const element = getElementAtPosition(x1, y1, elements);
        setClientViewRef(prev => ({...prev, lastInteractionElement: element}));
        
        if(tool !== 'select') {
            const element = handleCreateElement(x1, y1, tool);
            if(element) {
                setClientViewRef(prev => ({...prev, lastInteractionElement: element as EnrichedElement}));
                await rep.mutate.create_element(element);
            }
        }
        

        const action = handleInferAction(element?.positionWithinElement ?? null, tool);
        setAction(action);
        setCursor(canvas, tool, action, element);
    }, [clientViewRef, tool, setAction, handleCreateElement]);

    const handleMouseUp = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
        const clientView = clientViewRef.current;
        const canvas = canvasRef.current;
        if(!clientView || !canvas) return;
        const {camera, elements, lastClickedPosition, lastInteractionElement} = clientView;
        
        const {x1, y1} = getMouseCoordinates(e, camera);
        const element = getElementAtPosition(x1, y1, elements);

        const lastPos = lastClickedPosition;
        const isSamePosition = Math.abs(x1 - lastPos.x1) < 5 && Math.abs(y1 - lastPos.y1) < 5;
        
        if(tool === 'select' && isSamePosition) {
            handleSelectElementId(element);
        }

        if(action === 'moving' || action === 'drawing' || action === 'resizing') {
            const interactionElement = elements?.find(el => el.id === lastInteractionElement?.id);
            await rep.mutate.update_element(interactionElement) 
        }

        setAction(null);
        setTool('select');
        setClientViewRef(prev => ({...prev, lastClickedPosition: {x1: 0, y1: 0}, lastInteractionElement: null, ghostElement: null}));
        setCursor(canvas, tool, action,element);
    }, [clientViewRef, setAction, handleSelectElementId, setTool, setClientViewRef, rep]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const clientView = clientViewRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !clientView) return;
        const {camera, elements, lastInteractionElement} = clientView;

        const {x1, y1} = getMouseCoordinates(e, camera);
        const element = getElementAtPosition(x1, y1, elements);

        setCursor(canvas, tool, action, element);

        if(tool !== 'select') {
            requestAnimationFrame(() => handleGhostElement(x1, y1, tool));
        }

        if(action === 'moving' && lastInteractionElement) {
            requestAnimationFrame(() => handleMoveElement(x1, y1, lastInteractionElement));
        }

        if(action === 'drawing' && lastInteractionElement) {
            requestAnimationFrame(() => handleDrawElement(x1, y1, lastInteractionElement));
        }

        if(action === 'resizing' && lastInteractionElement) {
            const {type} = lastInteractionElement;
            if(type !== 'line') return;
            
            requestAnimationFrame(() => handleResizeElement(x1, y1, lastInteractionElement));
        }

    }, [clientViewRef, action, handleMoveElement, canvasRef, handleGhostElement, tool]);

    const handleMouseLeave = useCallback(() => {
        setClientViewRef(prev => ({...prev, ghostElement: null}));
    }, [setClientViewRef]);

    // Return memoized event handlers
    return useMemo(() => ({
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave
    }), [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave]);
}
