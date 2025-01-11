import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Camera } from "../types";
import { panCamera, zoomAtPoint } from "../utils/convert-position";
import { useCanvas } from "@/app/providers/CanvasProvider";


export const useUpdateCamera = () => {

    const {setCamera, canvasRef} = useCanvas();
    const canvas = canvasRef.current;


    const handleWheel = useCallback((event: WheelEvent) => {
        if(!canvas) return;
        event.preventDefault();

        if(event.ctrlKey) {
            const zoomFactor = Math.pow(0.99, event.deltaY);
            const zoomPointX = event.clientX - canvas.getBoundingClientRect().left 
            const zoomPointY = event.clientY - canvas.getBoundingClientRect().top
            setCamera(prev => zoomAtPoint(zoomPointX, zoomPointY, prev, zoomFactor));
        } else {
            setCamera(prev => panCamera(event.deltaX, event.deltaY, prev));
        }
    }, [canvas, setCamera]);



    return {handleWheel}


}