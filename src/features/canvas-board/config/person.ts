import { Element } from "@/types";
import { ShapeDefinition } from "../types";


export const person: ShapeDefinition = {
    minWidth: 200,
    minHeight: 225,
    color: 'red',
}


export const createDefaultPerson = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create'):Element => {
    const {minWidth, minHeight} = person;

    let x1 = mouseX;
    let y1 = mouseY;
    let x2 = x1 + minWidth;
    let y2 = y1 + minHeight;

    // move to mouse position so middle of the element is at the mouse position
    const halfWidth = minWidth / 2;
    const halfHeight = minHeight / 2;
    x1 = x1 - halfWidth;
    y1 = y1 - halfHeight;
    x2 = x1 + minWidth;
    y2 = y1 + minHeight;

    return {
        id: mode === 'ghost' ? `ghost-element-person` : crypto.randomUUID(),
        type: 'person',
        title: '',
        content: '',
        imageUrl: '',
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}