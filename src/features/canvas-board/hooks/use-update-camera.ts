import { useCallback } from "react";
import { moveCamera, panCamera, zoomAtPoint } from "../utils/convert-position";
import { ClientView, useCanvas } from "@/app/providers/CanvasProvider";
import { Element } from "@/types";
import { Camera } from "../types/camera";


export const useUpdateCamera = () => {

    const { setClientViewRef, canvasRef, clientViewRef } = useCanvas();
    const canvas = canvasRef.current;



    const handleWheel = useCallback((event: WheelEvent) => {
        if (!canvas) return;
        event.preventDefault();

        if (event.ctrlKey) {
            const ZOOM_SENSITIVITY = 20;
            const clampedDelta = Math.max(-ZOOM_SENSITIVITY, Math.min(ZOOM_SENSITIVITY, event.deltaY));

            const zoomFactor = Math.pow(0.99, clampedDelta);
            const zoomPointX = event.clientX - canvas.getBoundingClientRect().left
            const zoomPointY = event.clientY - canvas.getBoundingClientRect().top
            setClientViewRef(prev => ({ ...prev, camera: zoomAtPoint(zoomPointX, zoomPointY, prev.camera, zoomFactor) }));
        } else {
            setClientViewRef(prev => ({ ...prev, camera: panCamera(event.deltaX, event.deltaY, prev.camera) }));
        }
    }, [canvas, setClientViewRef]);



    const handleFindElement = useCallback((element: Element) => {
        if (!canvas) return;
        const elementPosition = element.position;
        const elementX = elementPosition.x1;
        const elementY = elementPosition.y1;
        const elementWidth = elementPosition.x2 - elementPosition.x1;
        const elementHeight = elementPosition.y2 - elementPosition.y1;
        const camera = clientViewRef.current.camera;

        const canvasWidth = canvas.getBoundingClientRect().width;
        const canvasHeight = canvas.getBoundingClientRect().height;

        const zoomFactor = 0.6;

        const middleX = elementX + elementWidth / 2;
        const middleY = elementY + elementHeight / 2;

        const bufferRight = 300;

        const pointXToMove = (middleX - bufferRight) - (canvasWidth / zoomFactor) / 2
        const pointYToMove = (middleY) - (canvasHeight / zoomFactor) / 2;


        setClientViewRef(prev => ({ ...prev, selectedElement: element, camera: moveCamera(pointXToMove, pointYToMove, prev.camera, zoomFactor) }));
    }, [canvas, setClientViewRef]);


    const handleAnimateCamera = (
        camera: Camera,
        deltaTime: number,
        setClientViewRef: React.Dispatch<React.SetStateAction<ClientView>>,
    ) => {
        const { animateCameraTo } = camera;
        
        if (!animateCameraTo) return camera;

        const { x1, y1, zoom, applyEase } = animateCameraTo;
        const ANIMATION_SPEED = 8.0;
        const PRECISION_THRESHOLD = 0.001;
        
        const ease = applyEase ? (1 - Math.exp(-ANIMATION_SPEED * deltaTime)) : 1;
        
        const x1Diff = x1 - camera.x1;
        const y1Diff = y1 - camera.y1;
        const zoomDiff = zoom - camera.zoom;
        
        const newCamera = {
            ...camera,
            x1: camera.x1 + x1Diff * ease,
            y1: camera.y1 + y1Diff * ease,
            zoom: camera.zoom + zoomDiff * ease
        };

        const isAnimationComplete = 
            Math.abs(x1Diff) < PRECISION_THRESHOLD && 
            Math.abs(y1Diff) < PRECISION_THRESHOLD && 
            Math.abs(zoomDiff) < PRECISION_THRESHOLD;

        if (isAnimationComplete) {
            setClientViewRef(prev => ({
                ...prev, 
                camera: {...prev.camera},
            }));
        } else {
            setClientViewRef(prev => ({
                ...prev, 
                camera: newCamera,
            }));
        }

        return newCamera;
    };







    return { handleWheel, handleFindElement, handleAnimateCamera };


}