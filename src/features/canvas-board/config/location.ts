import { Element } from "@/types";
import { LocationDefinition} from "../types";
import { BASE_URL } from "@/constants";


export const location: LocationDefinition = {
    minWidth: 175,
    minHeight: 200,
    color: '#fcd34d',
    polaroidBgColor: 'transparent',
    textColor: '#2C2420',
    padding: 15,
    gap: 20
}


export const createDefaultLocation = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create', boardId?:string):Element => {
    const {minWidth, minHeight} = location;

    const x1 = mouseX - minWidth / 2;
    const y1 = mouseY - minHeight / 2;
    const x2 = x1 + minWidth;
    const y2 = y1 + minHeight;

    return {
        id: mode === 'ghost' ? `ghost-element-location` : crypto.randomUUID(),
        type: 'location',
        contentId: null,
        boardId: boardId ?? null,
        imageUrl: `location.svg`,
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}