import { Element } from "@/types";
import {  NoteDefinition, PersonDefinition, ShapeDefinition } from "../types";


export const note : NoteDefinition = {
    minWidth: 320,
    minHeight: 250,
    color: '#FFEB81',
    padding:20,
}


export const createDefaultNote = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create',  creatorId:string, boardId?:string): Element => {
    const {minWidth, minHeight} = note;

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
        id: mode === 'ghost' ? `ghost-element-note` : crypto.randomUUID(),
        type: 'note',
        boardId: boardId ?? null,
        contentId: null,
        imageUrl:null,
        layer: 1,
        position: {x1, y1, x2, y2},
    };
}