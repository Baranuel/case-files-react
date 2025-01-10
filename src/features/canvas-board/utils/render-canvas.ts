import { Element } from "@/types/element";
import { scaleCanvas } from "./scale-canvas";
import { Camera } from "../types";

export const renderCanvas = (canvas: HTMLCanvasElement, camera: Camera, elements: Element[]) => {
    const dpr = window.devicePixelRatio;
    const ctx = canvas.getContext("2d");
    const {width, height} = scaleCanvas(canvas, dpr);    
    
    if(!ctx) return;

    ctx.save()
    ctx.scale(dpr, dpr);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(camera.x1, camera.y1);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillRect(100, 100, 200, 200);

    ctx.restore()
}