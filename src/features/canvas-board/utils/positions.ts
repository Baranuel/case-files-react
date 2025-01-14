import type { Camera } from "../types";
import { Element, EnrichedElement, PositionWithinElement } from "@/types/element";
import { toCanvasPosition, toDevicePosition } from "./convert-position";


export const nearPoint = (x: number, y: number, x1: number, y1: number, name: PositionWithinElement) => {
    return Math.abs(x - x1) < 10 && Math.abs(y - y1) < 10 ? name : null;
};



export const distance = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const onLine = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
};



export const positionWithinElement = (x: number, y: number, element: Element): PositionWithinElement => {
    const { type, position } = element;
    const { x1, y1, x2, y2 } = position;

    switch (type) {
        case "line":
            const on = onLine(x1, y1, x2, y2, x, y);
            const start = nearPoint(x, y, x1, y1, "start");
            const end = nearPoint(x, y, x2, y2, "end");
            const middle = nearPoint(x, y, x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, "line_middle");
            return start || end || middle || on;
        case "person":
        case "location":
            const { x1: rectX1, y1: rectY1, x2: rectX2, y2: rectY2 } = element.position;

            const middleX = (rectX1 + rectX2) / 2;
            const middleY = (rectY1 + rectY2) / 2;

            const topLeft = nearPoint(x, y, rectX1, rectY1, "tl");
            const topRight = nearPoint(x, y, rectX2, rectY1, "tr");
            const bottomLeft = nearPoint(x, y, rectX1, rectY2, "bl");
            const bottomRight = nearPoint(x, y, rectX2, rectY2, "br");
            const topMiddle = nearPoint(x, y, middleX, rectY1, "tm");
            const bottomMiddle = nearPoint(x, y, middleX, rectY2, "bm");
            const leftMiddle = nearPoint(x, y, rectX1, middleY, "ml");
            const rightMiddle = nearPoint(x, y, rectX2, middleY, "mr");
            const inside = x >= rectX1 && x <= rectX2 && y >= rectY1 && y <= rectY2 ? "inside" : null;
            return topLeft || topRight || bottomLeft || bottomRight || topMiddle || bottomMiddle || leftMiddle || rightMiddle || inside;
        default:
            throw new Error(`Type not recognised: ${type}`);
    }
};


export const getElementAtPosition = (x: number, y: number, elements: Element[]): EnrichedElement | null => {

    return elements
        .map(element => ({ ...element, positionWithinElement: positionWithinElement(x, y, element), offsetX: x - element.position.x1, offsetY: y - element.position.y1 }))
        .find(element => element.positionWithinElement !== null) || null;
};


export const elementsWithinCamera = (canvas: HTMLCanvasElement, elements: Element[], camera: Camera) => {
    return elements.filter(element => {
        const { x1, y1, x2, y2 } = element.position;

        // Get camera bounds
        const cameraX1 = camera.x1;
        const cameraY1 = camera.y1;
        const cameraX2 = camera.x1 + (canvas.width / camera.zoom);
        const cameraY2 = camera.y1 + (canvas.height / camera.zoom);

        // Check if element is completely outside camera view
        const isCompletelyOutside =
            (x1 < cameraX1 && x2 < cameraX1) || // Completely to the left
            (x1 > cameraX2 && x2 > cameraX2) || // Completely to the right
            (y1 < cameraY1 && y2 < cameraY1) || // Completely above
            (y1 > cameraY2 && y2 > cameraY2);   // Completely below

        // Return true if element intersects with or is inside camera view
        return !isCompletelyOutside;
    });
}


export const cursorForPosition = (position: string | null): string => {
    const cursorMap: Record<string, string> = {
        tl: "nwse-resize",
        br: "nwse-resize",
        start: "nwse-resize",
        end: "nwse-resize",
        line_middle: "text",
        tr: "nesw-resize",
        bl: "nesw-resize",
        tm: "ns-resize",
        bm: "ns-resize",
        ml: "ew-resize",
        mr: "ew-resize",
    };
    if (!position) return "default";
    return cursorMap[position] || "move";
};


export const resizedCoordinates = (clientX: number, clientY: number, position: string | null, coordinates: { x1: number, y1: number, x2: number, y2: number }) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
        case "tl":
        case "start":
            return { x1: clientX, y1: clientY, x2, y2 };
        case "tr":
            return { x1, y1: clientY, x2: clientX, y2 };
        case "bl":
            return { x1: clientX, y1, x2, y2: clientY };
        case "br":
        case "end":
            return { x1, y1, x2: clientX, y2: clientY };
        case "tm":
            return { x1, y1: clientY, x2, y2 };
        case "bm":
            return { x1, y1, x2, y2: clientY };
        case "ml":
            return { x1: clientX, y1, x2, y2 };
        case "mr":
            return { x1, y1, x2: clientX, y2 };
        default:
            return null; //should not really get here...
    }
};



export const getMouseCoordinates = (event: React.MouseEvent<HTMLCanvasElement>, camera: Camera) => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
  
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    const clientX = (screenX / camera.zoom) + camera.x1;
    const clientY = (screenY / camera.zoom) + camera.y1;
  
    return { x1: clientX, y1: clientY };
  };


export const adjustElementCoordinates = (element: Element) => {
    const { type, position } = element;
    const { x1, y1, x2, y2 } = position;
   
    return { x1, y1, x2, y2 };
};


