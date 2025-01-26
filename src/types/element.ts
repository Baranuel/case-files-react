
import {Content, Element as ZeroElement} from '@/schema'

export type ElementType = 'person' | 'location' | 'line'  

export type ElementPosition = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export type Element = ZeroElement & {
    content?:readonly Content[];
}

export type PositionWithinElement = 'start' | 'end' | 'line_middle' | 'tl' | 'tr' | 'tm' | 'bl' | 'br' | 'bm' | 'ml' | 'mr' | 'inside' | null ;

export type EnrichedElement = Element & {
    positionWithinElement: PositionWithinElement;
    offsetX: number;
    offsetY: number;
}