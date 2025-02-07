import { Element } from "@/types/element";
import { config } from "@/features/canvas-board/config";
import { LocationDefinition } from "@/features/canvas-board/types";
import { getImageCache } from "@/utils/image-cache";
import { handleRenderText } from "../handle-render-text";

const drawImage = (ctx: CanvasRenderingContext2D, imageUrl: string | null, x1: number, y1: number, height: number, width: number, padding: number, bgColor: string = '#ECD5B8') => {

    const imageX = x1 + padding
    const imageY = y1 + padding / 2
    const imageHeight = (height / 1.25) - padding * 2
    const imageWidth = width - padding * 2

    const dimensions = {
        imageX,
        imageY,
        imageHeight,
        imageWidth
    }


    if (!imageUrl) return dimensions

    const image = getImageCache(imageUrl)
    if (!image) return dimensions
    ctx.fillStyle = bgColor
    ctx.fillRect(imageX, imageY, imageWidth, imageHeight)
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight)
    return dimensions
}


export const handleRenderLocation = (ctx: CanvasRenderingContext2D, element: Element, selectedItemId: Element["id"] | null) => {
    const { type } = element;
    const { x1, y1, x2, y2 } = element.position;
    const { minWidth, minHeight, color, padding, gap, polaroidBgColor, textColor } = config[type] as LocationDefinition

    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);
    ctx.save()
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x1, y1, width, height, 10);
    ctx.fill();
    // image
    const { imageHeight, imageWidth } = drawImage(ctx, element.imageUrl, x1, y1, height, width, padding, polaroidBgColor)

    // text area
    const textAreaX = x1 + padding!
    const textAreaY = y1 + padding! + imageHeight + gap
    const textAreaWidth = imageWidth
    const textAreaHeight = height - padding! * 2 - imageHeight - gap

    ctx.fillStyle = 'transparent'
    ctx.fillRect(textAreaX, textAreaY, textAreaWidth, textAreaHeight)

    // text
    const textX = textAreaX
    const textY = textAreaY
    const textWidth = textAreaWidth
    const textHeight = textAreaHeight

    
    const text = element.content?.title ?? element.type ?? 'Location'
    const textOptions = {
        x: textX + textWidth / 2,
        y: textY + textHeight / 2,
        width: textWidth,
        height: textHeight,
        text,
        font: 'bold 32px sans-serif',
        color: textColor
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

export const handleRenderLocationGhost = (ctx: CanvasRenderingContext2D, element: Element) => {
    const { type } = element;
    const { x1, y1, x2, y2 } = element.position;
    const { minWidth, minHeight, color, padding, gap, textColor } = config[type] as LocationDefinition

    ctx.save()
    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);
    ctx.globalAlpha = 0.2
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, width, height);
    ctx.restore()
}