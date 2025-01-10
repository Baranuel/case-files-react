import { useCanvas } from "@/app/providers/CanvasProvider";
import { useEffect } from "react";

export const Canvas= () => {
    const {elements, canvasRef} = useCanvas();

    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        const dpr = window.devicePixelRatio;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

       

    }, [elements]);

    return <canvas className="bg-[#f5e6d3] w-full h-full" ref={canvasRef}></canvas>;
}