import { Element } from "@/types/element";
import { Camera } from "../../types";
import { handleRenderElement } from "./handle-render-element";

const dpr = window.devicePixelRatio;

export const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Camera) => {
    const gridSize = 80;
    const dotSize = 5;
    
    const startX = Math.floor(camera.x1 / gridSize) * gridSize;
    const startY = Math.floor(camera.y1 / gridSize) * gridSize;
    const endX = startX + (canvas.width / camera.zoom) + gridSize;
    const endY = startY + (canvas.height / camera.zoom) + gridSize;

    ctx.fillStyle = '#525252';
    for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
            ctx.fillRect(x, y, dotSize, dotSize);
        }
    }
}

export const renderCanvas = (canvas: HTMLCanvasElement, camera: Camera, elements: Element[], ghostElement: Element | null) => {
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;


    const ctx = canvas.getContext("2d");
    
    if(!ctx) return;

    ctx.save()
    ctx.scale(dpr, dpr);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(-camera.x1, -camera.y1);
    ctx.fillStyle = 'red';

    drawBackground(ctx, canvas, camera);
    elements.forEach(element => handleRenderElement(ctx, element));
    if(ghostElement) handleRenderElement(ctx, ghostElement);
    ctx.restore()
}