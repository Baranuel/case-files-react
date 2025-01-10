
export type ElementType = 'person' | 'location' | 'line'  

export type ElementPosition = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export type Element = {
    id: string;
    type: ElementType;
    title: string;
    content: string;
    position: ElementPosition;
    imageUrl: string | null;
}