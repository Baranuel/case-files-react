import { Element } from "@/types/element";
import { config } from "@/features/canvas-board/config";
import { LineDefinition } from "@/features/canvas-board/config/line";

export const handleRenderLine = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {color, lineWidth, dash} = config[type] as LineDefinition;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Add arrow head
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 15;
    
    ctx.beginPath();
    ctx.setLineDash([]); // Solid line for arrow head
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 4), y2 - headLength * Math.sin(angle - Math.PI / 4));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 4), y2 - headLength * Math.sin(angle + Math.PI / 4));
    ctx.stroke();
    
    ctx.restore();
}
