import { Element } from "@/types";
import { ShapeDefinition } from "../types";


export type LineDefinition = ShapeDefinition & {
    length: number;
    color: string;
    lineWidth: number;
    dash: number[];
}


export const line: LineDefinition = {
    minWidth: 150,
    minHeight: 250,
    length:100,
    color: '#FFEA84',
    lineWidth: 10,
    dash: [20, 20]
}


export const createDefaultLine = (x1:number, y1:number, mode: 'ghost' | 'create' = 'create',creatorId:string, boardId?:string):Element => {

    return {
        id: mode === 'ghost' ? `ghost-element-line` : crypto.randomUUID(),
        type: 'line',
        contentId: null,
        imageUrl:null,
        layer: 0,
        boardId: boardId ?? null,
        position: {x1, y1, x2:x1, y2:y1},
        creatorId
    };
}