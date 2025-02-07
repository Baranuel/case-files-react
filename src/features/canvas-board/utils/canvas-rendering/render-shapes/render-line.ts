import { Element } from "@/types/element";
import { config } from "@/features/canvas-board/config";
import { LineDefinition } from "@/features/canvas-board/config/line";

export const handleRenderLine = (ctx: CanvasRenderingContext2D, element: Element, selectedItemId: Element["id"] | null) => {
    if (element.type !== 'line') return;

    const {color, lineWidth, dash} = config[element.type] as LineDefinition;
    const { x1, y1, x2, y2 } = element.position;
    const headLength = 45;
    const headAngle = Math.PI / 4;

    ctx.save();
    
    ctx.strokeStyle = selectedItemId === element.id ? '#FFEB3B' : color;
    ctx.fillStyle = selectedItemId === element.id ? '#FFEB3B' : color;
    ctx.lineWidth = selectedItemId === element.id ? lineWidth * 2 : lineWidth;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const length = Math.hypot(dx, dy);

    if (length > 5) {
        ctx.setLineDash(dash);
        const lineEndOffset = Math.min(headLength * 0.7, length * 0.15);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const lineEndX = x2 - lineEndOffset * cos;
        const lineEndY = y2 - lineEndOffset * sin;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLength * Math.cos(angle - headAngle),
            y2 - headLength * Math.sin(angle - headAngle)
        );
        ctx.lineTo(
            x2 - headLength * Math.cos(angle + headAngle),
            y2 - headLength * Math.sin(angle + headAngle)
        );
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

        // Draw noir style selection box if selected
        if (selectedItemId === element.id) {
            ctx.strokeStyle = '#FFEB3B';
            ctx.shadowColor = '#FFEB3B';
            ctx.shadowBlur = 10;
        }
    
    ctx.restore()
}
