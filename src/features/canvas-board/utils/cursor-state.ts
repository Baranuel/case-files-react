import { ActionType, EnrichedElement, Tool } from "@/types";

export const setCursor = (canvas: HTMLCanvasElement, tool: Tool, action: ActionType | null, element: EnrichedElement | null) => {

    if(tool === 'select') {
        if(!element) return canvas.style.cursor = 'default';
        if(element.positionWithinElement === 'start' || element.positionWithinElement === 'end') return canvas.style.cursor = 'crosshair';
        if(element.positionWithinElement === 'inside') return canvas.style.cursor = 'pointer';
        return canvas.style.cursor = 'default';
    }
}