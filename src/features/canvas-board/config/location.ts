import { Element } from "@/types";
import { LocationDefinition, ShapeDefinition } from "../types";
import { BASE_URL } from "@/constants";


export const location: LocationDefinition = {
    minWidth: 175,
    minHeight: 200,
    color: '#1a1614',
    polaroidBgColor: '#1a1614',
    textColor: '#fcd34d',
    padding: 15,
    gap: 20
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
        title: 'Location Area',
        content: '',
        imageUrl: `${BASE_URL}/location.svg`,
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}