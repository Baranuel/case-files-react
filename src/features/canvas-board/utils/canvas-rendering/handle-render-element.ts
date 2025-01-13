import { Element } from "@/types/element";
import { handleRenderGhostElement } from "./handle-render-ghost-element";
import { handleRenderPerson } from "./render-shapes/render-person";
import { handleRenderLocation } from "./render-shapes/render-location";

export const handleRenderElement = (ctx: CanvasRenderingContext2D, element: Element) => {

    if(element.id.includes('ghost-element')) return handleRenderGhostElement(ctx, element);

    switch(element.type) {
        case 'person':
            handleRenderPerson(ctx, element);
            break;
        case 'location':
            handleRenderLocation(ctx, element);
            break;
        default:
            break;
    }
}


