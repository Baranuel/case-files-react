import { Element } from "@/schema"
import { loadAndCacheImageBitMap } from "@/utils/image-cache"
import { useCallback, useEffect, useMemo, useState } from "react"

export const useImageCache = (visibleElements: Element[]) => {
    const [imagesLoaded] = useState(false);
    const variousImageUrls = useMemo(() => new Set(visibleElements.map(element => element.imageUrl)), [visibleElements]);

    const loadImages = useCallback(async () => {
        if (visibleElements.length === 0) return;
        const arrayOfImageUrls = Array.from(variousImageUrls);

        const promises = arrayOfImageUrls.map(imageUrl => {
            if (!imageUrl) return Promise.resolve();
            return loadAndCacheImageBitMap(imageUrl);
        });
        
        await Promise.all(promises);
    }, [variousImageUrls]);

    useEffect(() => {
        loadImages();
    }, [variousImageUrls]);

    return { cacheLoaded: imagesLoaded };
}
