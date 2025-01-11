import { Element } from "@/types/element";
import { config } from "../../../config";
import { getImageCache, loadAndCacheImage } from "@/utils/image-cache";


export const handleRenderPerson = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color} = config[type];

    const width = Math.max(x2 - x1, minWidth);
    const height = Math.max(y2 - y1, minHeight);

    ctx.fillStyle = color ?? 'red';
    ctx.fillRect(x1, y1, width, height);

    if(element.imageUrl){
        const image = getImageCache(element.imageUrl)
        if(!image) return
        ctx.drawImage(image, x1, y1, width, height)
    }
}

export const handleRenderPersonGhost = (ctx: CanvasRenderingContext2D, element: Element) => {
    const {type} = element;
    const {x1, y1, x2, y2} = element.position;
    const {minWidth, minHeight, color} = config[type];

    const width = Math.min(x2 - x1, minWidth ?? 0);
    const height = Math.min(y2 - y1, minHeight ?? 0);
    
    ctx.save()
    ctx.globalAlpha = 0.2;
    ctx.fillRect(x1, y1, width, height);

    ctx.restore()
}