import { Element } from "@/schema"
import { loadAndCacheImage } from "@/utils/image-cache"
import { useCallback, useEffect, useMemo, useState } from "react"

export const useImageCache = (visibleElements:Element[]) => {
    const [imagesLoaded] = useState(false);

    const variousImageUrls = useMemo(() => new Set(visibleElements.map(element => element.imageUrl)), [visibleElements]);

    const loadImages = useCallback(async () => {
        if(visibleElements.length === 0) return;
        
        const promises = visibleElements.map(element => {
            if (element.imageUrl) {
                return loadAndCacheImage(element.imageUrl);
            }
            return Promise.resolve();
        });
        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }, [variousImageUrls]);

    useEffect(() => {
        loadImages();
        // loadBucketImages();
    }, [variousImageUrls]);

    return { cacheLoaded: imagesLoaded };
}
