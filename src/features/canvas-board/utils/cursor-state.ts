import { ActionType, EnrichedElement, Tool } from "@/types";

export const setCursor = (canvas: HTMLCanvasElement, tool: Tool, action: ActionType | null, element: EnrichedElement | null) => {

    if(tool === 'select') {
        if(!element) return canvas.style.cursor = 'default';
        if(action === null) return canvas.style.cursor = 'pointer';
        if(action === 'moving') return canvas.style.cursor = 'grabbing';

        return canvas.style.cursor = 'default';
    }
}