import { Element } from "@/types/element";
import { config } from "../../../config";
import { getImageCache } from "@/utils/image-cache";
import { PersonDefinition } from "@/features/canvas-board/types";
import { handleRenderText } from "../handle-render-text";


const drawImage = (ctx: CanvasRenderingContext2D, imageUrl: string | null, x1: number, y1: number, height:number, width:number, padding:number, bgColor:string = '#ECD5B8') => {
    ctx.save()

        const imageX = x1 + padding
        const imageY = y1 + padding
        const imageHeight = (height / 1.2) - padding * 2
        const imageWidth = width - padding * 2

        const dimensions = {
            imageX,
            imageY,
            imageHeight,
            imageWidth
        }
    
        ctx.fillStyle = bgColor
        ctx.fillRect(imageX, imageY, imageWidth, imageHeight)
        
        if(!imageUrl) return dimensions
        
        const image = getImageCache(imageUrl)
        if(!image) return dimensions
        
        ctx.drawImage(image, imageX, imageY,imageWidth, imageHeight)
        ctx.restore()
        return dimensions
}


export const handleRenderPerson = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color, padding, gap} = config[type] as PersonDefinition

    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);

    ctx.save()
    ctx.fillStyle = color ?? 'red';
    ctx.fillRect(x1, y1, width, height);
    
    // polaroid image
    const {imageHeight, imageWidth} = drawImage(ctx, element.imageUrl, x1, y1, height, width, padding!)

    // text area
    const textAreaX = x1 + padding!
    const textAreaY = y1 + padding! + imageHeight + gap
    const textAreaWidth = imageWidth
    const textAreaHeight = height - (padding! * 2) - imageHeight - gap

    ctx.fillStyle = 'transparent'
    ctx.fillRect(textAreaX, textAreaY, textAreaWidth, textAreaHeight)

    // text
    const textX = textAreaX 
    const textY = textAreaY
    const textWidth = textAreaWidth 
    const textHeight = textAreaHeight

    const text = element.content?.[0].title ?? element.type

    const textOptions = {
        x: textX + textWidth / 2,
        y: textY + textHeight / 2,
        width: textWidth,
        height: textHeight,
        text,
        font: 'bold 38px Arial',
        color: '#000'
    }
    
    handleRenderText(ctx, textOptions)
    ctx.restore()
}

export const handleRenderPersonGhost = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, padding} = config[type] as PersonDefinition

    const width = Math.min(x2 - x1, minWidth ?? 0);
    const height = Math.min(y2 - y1, minHeight ?? 0);
    
    ctx.save()
    ctx.globalAlpha = 0.2;
    ctx.fillRect(x1, y1, width, height);

    drawImage(ctx,null, x1, y1, height,width,padding, '#525252')

    ctx.restore()
}