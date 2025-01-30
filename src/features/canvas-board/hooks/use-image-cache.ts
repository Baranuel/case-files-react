import { Element } from "@/schema"
import { loadAndCacheImageBitMap } from "@/utils/image-cache"
import { useCallback, useEffect, useMemo, useState } from "react"

const cdnUrl = import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_CDN_URL + '/' + import.meta.env.VITE_DIGITAL_OCEAN_BUCKET_IMAGES_PATH
const placeholderImageUrls = [`${cdnUrl}/avatar-m.svg`, `${cdnUrl}/avatar-w.svg`]

export const useImageCache = (visibleElements: Element[]) => {
    const [imagesLoaded] = useState(false);
    const variousImageUrls = useMemo(() => new Set(visibleElements.map(element => element.imageUrl)), [visibleElements]);

    const arrayOfImageUrls = Array.from(variousImageUrls);

    const loadImages = useCallback(async () => {
        if (visibleElements.length === 0) return;
        const promises = [...placeholderImageUrls, ...arrayOfImageUrls].map(imageUrl => {
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
