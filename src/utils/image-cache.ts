import { BASE_URL } from "@/constants";
import { svgToPng } from "./svg-to-png";

const imageCache = new Map<string, ImageBitmap>();


export const setImageCache = async (imageUrl: string, image: ImageBitmap) => {
    imageCache.set(imageUrl, image);
}

export const getImageCache = (imageUrl: string): ImageBitmap | undefined => {
    return imageCache.get(imageUrl);
}


{/* This loads a cache for canvas images so they don't download on every frame */}
export const loadAndCacheImageBitMap = async (imageUrl: string): Promise<ImageBitmap | null> => {
    const cached = getImageCache(imageUrl);
    if (cached) return cached;

    
    const isRemoteImage = imageUrl.startsWith('http');
    const imageUrlToLoad = isRemoteImage ? imageUrl : `${BASE_URL}/${imageUrl}`;

    const response = await fetch(imageUrlToLoad);
    const blob = await response.blob();

    if(imageUrl.includes('.svg')) {
        const pngUrl = await svgToPng(imageUrl, 300, 300);
        const response = await fetch(pngUrl);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        setImageCache(imageUrl, imageBitmap);
        return imageBitmap;
    }

    const imageBitmap = await createImageBitmap(blob);
    
    setImageCache(imageUrl, imageBitmap);
    return imageBitmap;
}
