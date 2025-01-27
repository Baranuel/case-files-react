import { Element } from "@/types";
import { LocationDefinition} from "../types";


export const location: LocationDefinition = {
    minWidth: 250,
    minHeight: 300,
    color: '#EF9952',
    polaroidBgColor: '#EF9952',
    textColor: '#0E0B09',
    padding: 10,
    gap:-10
}


export const createDefaultLocation = (mouseX: number, mouseY: number, mode: 'ghost' | 'create' = 'create',creatorId:string, boardId?:string):Element => {
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
        imageUrl: `${import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL!}/${import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_IMAGES_PATH!}/location.svg`,
        layer: 0,
        position: {x1, y1, x2, y2},
    };
}