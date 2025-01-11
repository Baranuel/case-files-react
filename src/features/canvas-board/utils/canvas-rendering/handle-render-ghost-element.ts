import { Element } from "@/types/element";
import { handleRenderPersonGhost } from "./render-shapes/person";
export const handleRenderGhostElement = (ctx: CanvasRenderingContext2D, element: Element) => {
   
    switch(element.type) {
        case 'person':
            handleRenderPersonGhost(ctx, element);
            break;
        default:
            break;
    }
}   