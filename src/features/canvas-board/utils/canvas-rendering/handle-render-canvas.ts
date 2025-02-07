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

    ctx.fillStyle = '#483A32';
    for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
            ctx.fillRect(x, y, dotSize, dotSize);
        }
    }
}

export const renderCanvas = (canvas: HTMLCanvasElement, camera: Camera, elements: Element[], ghostElement: Element | null, selectedItemId: Element["id"] | null) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    
    if(!ctx) return;

    const layeredElements = elements.sort((a, b) => a.layer - b.layer);
    
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(-camera.x1, -camera.y1);
    ctx.fillStyle = 'red';

    drawBackground(ctx, canvas, camera);
    
    // Get selected element position for menu
    const selectedElement = elements.find(el => el.id === selectedItemId);
    let menuPosition = null;
    
    layeredElements.forEach(element => {
        handleRenderElement(ctx, element, selectedItemId);
        
        // Calculate menu position for selected element
        if (element.id === selectedItemId) {
            const { x2, y1 } = element.position;
            menuPosition = {
                x: (x2 + 10) * camera.zoom - camera.x1 * camera.zoom,
                y: y1 * camera.zoom - camera.y1 * camera.zoom
            };
        }
    });
    
    if(ghostElement) handleRenderElement(ctx, ghostElement, selectedItemId);
    ctx.restore();

    // Return menu position for the selected element
    return menuPosition;
}