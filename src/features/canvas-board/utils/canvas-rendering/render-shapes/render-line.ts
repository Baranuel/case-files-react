import { Element } from "@/types/element";
import { config } from "@/features/canvas-board/config";
import { LineDefinition } from "@/features/canvas-board/config/line";

export const handleRenderLine = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {color, lineWidth, dash} = config[type] as LineDefinition;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    
    // Round the coordinates to prevent sub-pixel rendering issues
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();

    // Add arrow head with rounded coordinates
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 15;
    
    ctx.setLineDash([]); // Solid line for arrow head
    ctx.moveTo(Math.round(x2), Math.round(y2));
    ctx.lineTo(
        Math.round(x2 - headLength * Math.cos(angle - Math.PI / 4)),
        Math.round(y2 - headLength * Math.sin(angle - Math.PI / 4))
    );
    ctx.moveTo(Math.round(x2), Math.round(y2));
    ctx.lineTo(
        Math.round(x2 - headLength * Math.cos(angle + Math.PI / 4)),
        Math.round(y2 - headLength * Math.sin(angle + Math.PI / 4))
    );
    ctx.stroke();
}
