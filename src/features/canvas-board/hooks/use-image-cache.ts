import { Element } from "@/schema"
import { loadAndCacheImage } from "@/utils/image-cache"
import { useEffect, useState } from "react"

export const useImageCache = (visibleElements:readonly Element[]) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const loadImages = async () => {
        if(visibleElements.length === 0) return;
        const promises = visibleElements.map(element => {
            if (element.imageUrl) {
                return loadAndCacheImage(element.imageUrl);
            }
            return Promise.resolve();
        });
        try {
            await Promise.all(promises);
            setImagesLoaded(true);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };
    useEffect(() => {
        loadImages();
    }, [visibleElements]);

    return { cacheLoaded: imagesLoaded };
}
