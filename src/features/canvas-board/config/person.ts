import { Element } from "@/types";
import {  PersonDefinition, ShapeDefinition } from "../types";
import { BASE_URL } from "@/constants";


export const person: PersonDefinition = {
    minWidth: 325,
    minHeight: 425,
    color: '#FFF0DF',
    padding:10,
    gap:0
}


export const createDefaultPerson = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create',  creatorId:string, boardId?:string): Element => {
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
        boardId: boardId ?? null,
        contentId: null,
        imageUrl: `${import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL!}/${import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_IMAGES_PATH!}/${randomAvatar}`,
        layer: 0,
        position: {x1, y1, x2, y2},
        creatorId
    };
}