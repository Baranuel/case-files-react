import { useCallback } from "react";
import { panCamera, zoomAtPoint } from "../utils/convert-position";
import { useCanvas } from "@/app/providers/CanvasProvider";


export const useUpdateCamera = () => {

    const {setClientViewRef, canvasRef, clientViewRef} = useCanvas();
    const canvas = canvasRef.current;

    const handleWheel = useCallback((event: WheelEvent) => {
        if(!canvas) return;
        event.preventDefault();

        if(event.ctrlKey) {
            const zoomFactor = Math.pow(0.99, event.deltaY);
            const zoomPointX = event.clientX - canvas.getBoundingClientRect().left 
            const zoomPointY = event.clientY - canvas.getBoundingClientRect().top
            setClientViewRef(prev => ({...prev, camera: zoomAtPoint(zoomPointX, zoomPointY, prev.camera, zoomFactor)}));
        } else {
            setClientViewRef(prev => ({...prev, camera: panCamera(event.deltaX, event.deltaY, prev.camera)}));
        }
    }, [canvas, setClientViewRef]);



    return {handleWheel}


}