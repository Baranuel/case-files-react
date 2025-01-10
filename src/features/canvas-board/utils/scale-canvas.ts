
export const scaleCanvas = (canvas: HTMLCanvasElement, dpr: number) => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    return {
        width: rect.width,
        height: rect.height
    }
}