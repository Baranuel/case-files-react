import { Element } from "@/types";
import {  PersonDefinition, ShapeDefinition } from "../types";
import { BASE_URL } from "@/constants";


export const person: PersonDefinition = {
    minWidth: 250,
    minHeight: 325,
    color: '#F7EBE8',
    padding:15,
    gap:10
}


export const createDefaultPerson = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create'): Element => {
    const {minWidth, minHeight} = person;
    const randomAvatar = (Math.random() * 1) + 0.5 > 1 ? 'avatar-m.svg' : 'avatar-w.svg'

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
        contentId: null,
        imageUrl: `${randomAvatar}`,
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}