import { Element } from "@/types/element";
import { config } from "@/features/canvas-board/config";
import { LocationDefinition } from "@/features/canvas-board/types";
import { getImageCache } from "@/utils/image-cache";

const drawImage = (ctx: CanvasRenderingContext2D, imageUrl: string | null, x1: number, y1: number, height:number, width:number, padding:number, bgColor:string = '#ECD5B8') => {

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


    if(!imageUrl) return dimensions

    const image = getImageCache(imageUrl)
    if(!image) return dimensions

    ctx.drawImage(image, imageX , imageY ,imageWidth , imageHeight )
    return dimensions
}


export const handleRenderLocation = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color, padding, gap, polaroidBgColor, textColor} = config[type] as LocationDefinition

    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);

    ctx.save()  
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, width, height);

    // image
    const { imageHeight, imageWidth} = drawImage(ctx, element.imageUrl, x1, y1, height, width, padding, color)

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
 
     ctx.fillStyle = textColor
     ctx.font = 'bold 20px Arial'
     ctx.textBaseline = 'middle'
     ctx.textAlign = 'center'
     
     ctx.fillText(element.title, textX + textWidth / 2, textY + textHeight / 2, textWidth)
     ctx.restore()
}

export const handleRenderLocationGhost = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color, padding, gap, textColor} = config[type] as LocationDefinition

    ctx.save()
    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);
    ctx.globalAlpha = 0.2
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, width, height);
    ctx.restore()
}