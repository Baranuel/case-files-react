import { Element } from "@/types";
import { ShapeDefinition } from "../types";


export const location: ShapeDefinition = {
    minWidth: 150,
    minHeight: 250,
    color: 'red',
}


export const createDefaultLocation = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create'):Element => {
    const {minWidth, minHeight} = location;

    const x1 = mouseX - minWidth / 2;
    const y1 = mouseY - minHeight / 2;
    const x2 = x1 + minWidth;
    const y2 = y1 + minHeight;

    return {
        id: mode === 'ghost' ? `ghost-element-location` : crypto.randomUUID(),
        type: 'location',
        title: '',
        content: '',
        imageUrl: '',
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}