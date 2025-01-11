import { ShapeDefinition } from "../types";


type LineDefinition = ShapeDefinition & {
    length: number;
}


export const line: LineDefinition = {
    minWidth: 150,
    minHeight: 250,
    color: 'red',
    length: 100
}