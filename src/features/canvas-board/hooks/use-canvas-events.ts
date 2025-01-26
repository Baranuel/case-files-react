import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback, useMemo, useState } from "react";
import { getElementAtPosition, getMouseCoordinates } from "../utils/positions";
import { handleInferAction } from "../utils/handle-infer-action";
import { useHandleElement } from "./use-handle-element";
import { EnrichedElement } from "@/types";
import { setCursor } from "../utils/cursor-state";
import { ZeroSchema } from "@/schema";
import { useZero } from "@rocicorp/zero/react";
import { panCamera } from "../utils/convert-position";

export const useCanvasEvents = () => {
    const z = useZero<ZeroSchema>();

    const {
        clientViewRef,
        tool,
        action,
        setAction,
        canvasRef,
        setTool,
        setClientViewRef,
        setPreviewElementId,
        previewElementId
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
        if(!element && !previewElementId) return;
        if(element?.type === 'line') return;


        if('startViewTransition' in document) {
            document.startViewTransition(() => {
                setPreviewElementId(element?.id ?? null);
            });
        } else {
            setPreviewElementId(element?.id ?? null);
        }
    }, [setPreviewElementId, previewElementId]);

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
                z.mutateBatch(async tx => {
                    const randomId = crypto.randomUUID();
                    await tx.element.insert(element)
                    await tx.content.insert({
                        id: randomId,
                        title: element.type,
                        content: element.type,
                    })
                    await tx.element.update({id:element.id, contentId: randomId})
                });
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
            if(!interactionElement) return;
            z.mutate.element.update({id: interactionElement.id, position: interactionElement.position});
        }

        setClientViewRef(prev => ({...prev, lastClickedPosition: {x1: 0, y1: 0}, lastInteractionElement: null, ghostElement: null, panning: false}));
        setAction(null);
        setTool('select');
        setCursor(canvas, tool, action,element);
    }, [clientViewRef, setAction, handleSelectElementId, setTool, setClientViewRef]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const clientView = clientViewRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !clientView) return;
        const {camera, elements, lastInteractionElement} = clientView;

        const {x1, y1} = getMouseCoordinates(e, camera);
        const element = getElementAtPosition(x1, y1, elements);

        setCursor(canvas, tool, action, element);
        
        if(clientViewRef.current.panning) {
            setCursor(canvas, tool, action, element, true);
            setClientViewRef(prev => ({...prev, camera: panCamera(e.movementX, e.movementY, prev.camera, true)}));
        }

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

    }, [clientViewRef, action, handleMoveElement, canvasRef, handleGhostElement, tool, setClientViewRef]);

    const handleMouseLeave = useCallback(() => {
        setClientViewRef(prev => ({...prev, ghostElement: null, panning: false}));
    }, [setClientViewRef]);

    const handleKeyDown = useCallback((e: KeyboardEvent, canvas: HTMLCanvasElement) => {
        if(e.key === ' ') {
            canvas.style.cursor = 'grabbing';
            setClientViewRef(prev => ({...prev, panning: true}));
        }
    }, [setClientViewRef]);

    const handleKeyUp = useCallback((e: KeyboardEvent, canvas: HTMLCanvasElement) => {
        if(e.key === ' ') {
            canvas.style.cursor = 'default';
            setClientViewRef(prev => ({...prev, panning: false}));
        }
    }, [setClientViewRef]);

    // Return memoized event handlers
    return useMemo(() => ({
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave,
        handleKeyDown,
        handleKeyUp
    }), [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave, handleKeyDown, handleKeyUp]);
}