import { Element } from "@/types/element";
import { handleRenderGhostElement } from "./handle-render-ghost-element";
import { handleRenderPerson } from "./render-shapes/render-person";
import { handleRenderLocation } from "./render-shapes/render-location";
import { handleRenderLine } from "./render-shapes/render-line";
import { handleRenderNote } from "./render-shapes/render-note";

export const handleRenderElement = (ctx: CanvasRenderingContext2D, element: Element, selectedItemId: Element["id"] | null) => {
    if(element.id.includes('ghost-element')) return handleRenderGhostElement(ctx, element);

    switch(element.type) {
        case 'person':
            handleRenderPerson(ctx, element, selectedItemId);
            break;
        case 'location':
            handleRenderLocation(ctx, element, selectedItemId);
            break;
        case 'line':
            handleRenderLine(ctx, element, selectedItemId);
            break;
        case 'note':
            handleRenderNote(ctx, element, selectedItemId);
            break;
        default:
            break;
    }
}


