import { useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export const useIntersectionObserver = (attributeToObserve: string) => {
    const [observedElements, setObservedElements] = useState<Set<string>>(new Set());
    const observer = useRef<IntersectionObserver | null>(null);

    const instantiateObserver = () => new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            setObservedElements(prev => new Set([...prev, entry.target.getAttribute(attributeToObserve) || '']));
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    useEffect(() => {
        observer.current = instantiateObserver();
        return () => observer.current?.disconnect();
    }, []);

    const observe = useCallback((element: HTMLElement | null) => {
        if (element && observer.current) {
            observer.current.observe(element);
        }
    }, []);

    return { observedElements, observe };
};