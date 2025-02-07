import { Element } from "@/types/element";
import { config } from "../../../config";
import { getImageCache } from "@/utils/image-cache";
import { NoteDefinition, PersonDefinition } from "@/features/canvas-board/types";
import { handleRenderText } from "../handle-render-text";




export const handleRenderNote = (ctx: CanvasRenderingContext2D, element: Element, selectedItemId: Element["id"] | null) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color, padding} = config[type] as NoteDefinition

    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);

    ctx.save()
    
    // Draw post-it note
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = color ?? '#FFEB81';
    ctx.fillRect(x1, y1, width, height);
        
    // Draw pin head
    const pinSize = 12;
    ctx.beginPath();
    ctx.arc(x1 + width/2, y1 + pinSize/2, pinSize, 0, Math.PI * 2);
    ctx.fillStyle = '#FF0000'; // Red pin head
    ctx.fill();
    
    // Add pin shine
    ctx.beginPath();
    ctx.arc(x1 + width/2 - 2, y1 + pinSize/2 - 2, pinSize/4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();

    // Text area setup
    const textAreaX = x1 + padding!
    const textAreaY = y1 + padding!
    const textAreaWidth = width - (padding! * 2)
    const textAreaHeight = height - (padding! * 2)

    // Text rendering
    const text = element.content?.notes ?? element.type ?? 'Note'
    const textOptions = {
        x: textAreaX + textAreaWidth / 2,
        y: textAreaY + textAreaHeight / 2,
        width: textAreaWidth,
        height: textAreaHeight,
        text,
        font: 'bold 36px "Courier New"',
        color: '#2B2B2B'
    }
    
    handleRenderText(ctx, textOptions)
      // Draw noir style selection box if selected
      if (selectedItemId === element.id) {
        ctx.strokeStyle = '#FFEB3B';
        ctx.lineWidth = 5;
        ctx.setLineDash([10, 10]);
        ctx.strokeRect(x1 - 15, y1 - 15, width + 30, height + 30);
        
    }

    ctx.restore()
}

export const handleRenderNoteGhost = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight} = config[type] as NoteDefinition

    const width = Math.min(x2 - x1, minWidth ?? 0);
    const height = Math.min(y2 - y1, minHeight ?? 0);
    
    ctx.save()
    ctx.globalAlpha = 0.2;
    ctx.fillRect(x1, y1, width, height);


    ctx.restore()
}