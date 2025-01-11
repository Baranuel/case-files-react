import { useCanvas } from "@/app/providers/CanvasProvider"
import { Element } from "@/types"
import { loadAndCacheImage } from "@/utils/image-cache"
import { useEffect, useState } from "react"

export const useImageCache = (visibleElements: Element[]) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            try {
                await Promise.all(visibleElements.map(element => {
                    if (element.imageUrl) {
                        return loadAndCacheImage(element.imageUrl);
                    }
                    return Promise.resolve();
                }));
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error loading images:', error);
                setImagesLoaded(true); // Still set to true to allow rendering
            }
        };


        setImagesLoaded(false);
        loadImages();


    }, [visibleElements]);

    return { cacheLoaded: imagesLoaded };
}
