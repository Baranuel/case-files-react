import { ElementType, Tool } from "@/types";
import { createDefaultLocation } from "../config/location";
import { createDefaultPerson } from "../config/person";
import { createDefaultLine } from "../config/line";

export const getDefaultShape = (tool: Tool, x1: number, y1: number, mode: 'ghost' | 'create' = 'create' ) => {
    switch(tool) {
        case 'person':
            return createDefaultPerson(x1, y1, mode);
        case 'location':
            return createDefaultLocation(x1, y1, mode);
        case 'line':
            return createDefaultLine(x1, y1, mode);
        default:
            return null;
    }
}   