import { useCanvas } from "@/app/providers/CanvasProvider";
import { useCallback,  useEffect,  useLayoutEffect } from "react";
import { renderCanvas } from "../utils/render-canvas";
import { useCamera } from "../hooks/use-camera";


export const Canvas = () => {
    const {elements, canvasRef} = useCanvas();

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



    //event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        window.addEventListener('resize', handleRenderCanvas);
        return () => window.removeEventListener('resize', handleRenderCanvas);
    }, [handleRenderCanvas]);

    return <canvas
     className="bg-[#f5e6d3] w-full h-full" 
     ref={canvasRef}
     ></canvas>;
}
