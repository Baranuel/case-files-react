import { useCallback, useLayoutEffect, useState } from "react";
import { Camera } from "../types";
import { panCamera, zoomAtPoint } from "../utils/convert-position";


export const useCamera = (canvas: HTMLCanvasElement | null) => {
    const defaultCamera: Camera = {
        x1: 0,
        y1: 0,
        zoom: 1
    }
    const [camera, setCamera] = useState<Camera>(defaultCamera);

    const handleWheel = useCallback((event: WheelEvent) => {
        if(!canvas) return;
        event.preventDefault();

        if(event.ctrlKey) {
            const zoomFactor = Math.pow(0.99, event.deltaY);
            const zoomPointX = canvas.getBoundingClientRect().left - event.clientX;
            const zoomPointY = canvas.getBoundingClientRect().top - event.clientY;
            setCamera(prev => zoomAtPoint(zoomPointX, zoomPointY, prev, zoomFactor));
        } else {
            setCamera(prev => panCamera(-event.deltaX, -event.deltaY, prev));
        }
    }, [canvas]);


    useLayoutEffect(() => { 
        if(!canvas) return;
        canvas.addEventListener('wheel', handleWheel);
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [canvas, handleWheel])

    return { camera };
}