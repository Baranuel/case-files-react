import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback,  useEffect,  useLayoutEffect } from "react";
import { renderCanvas } from "../utils/render-canvas";
import { useCamera } from "../hooks/use-camera";



export const Canvas = () => {
    const {elements, canvasRef, setSelectedItemId, selectedItemId} = useCanvas();

    const {camera} = useCamera(canvasRef.current);
    
    const handleRenderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        renderCanvas(canvas, camera, elements);
    }, [canvasRef, elements, camera]);


    //main render loop
    useLayoutEffect(() => {
        const frame = requestAnimationFrame(handleRenderCanvas);
        return () => cancelAnimationFrame(frame);
    }, [handleRenderCanvas]);

    const handleCanvasClick = useCallback((event: MouseEvent) => {

            if(selectedItemId) return setSelectedItemId(null);
            setSelectedItemId(Math.random().toString());

    }, [setSelectedItemId, selectedItemId]);

    // canvas event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.addEventListener('click', handleCanvasClick);
        return () => canvas.removeEventListener('click', handleCanvasClick);
    }, [handleCanvasClick]);



    //window event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        window.addEventListener('resize', handleRenderCanvas);
        return () => window.removeEventListener('resize', handleRenderCanvas);
    }, [handleRenderCanvas]);

    return <canvas
     className="bg-[#2c2420] w-full h-full rounded-lg" 
     ref={canvasRef}
     ></canvas>
}
