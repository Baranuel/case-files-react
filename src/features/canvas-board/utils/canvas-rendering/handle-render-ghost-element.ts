import { Element } from "@/types/element";
import { handleRenderPersonGhost } from "./render-shapes/render-person";
import { handleRenderLocation, handleRenderLocationGhost } from "./render-shapes/render-location";
import { handleRenderNoteGhost } from "./render-shapes/render-note";
export const handleRenderGhostElement = (ctx: CanvasRenderingContext2D, element: Element) => {
   
    switch(element.type) {
        case 'person':
            handleRenderPersonGhost(ctx, element);
            break;
        case 'location':
            handleRenderLocationGhost(ctx, element);
            break;
        case 'note':
            handleRenderNoteGhost(ctx, element);
            break;
        default:
            break;
    }
}   