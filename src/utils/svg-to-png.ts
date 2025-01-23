
export const svgToPng = async (svg: string, targetWidth: number = 200, targetHeight: number = 500): Promise<string> => {

    const svgResponse = await fetch(`${svg}`).then(res => res.text());

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgResponse, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    const originalWidth = parseFloat(svgElement.getAttribute("width") || "100");
    const originalHeight = parseFloat(svgElement.getAttribute("height") || "100");

    const scale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    if (!ctx) throw new Error('Failed to get canvas context');

    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function () {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }
            // Draw the image with scaling
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
            const pngUrl = canvas.toDataURL("image/png");
            resolve(pngUrl);
        };

        img.onerror = () => {
            reject(new Error("Failed to load SVG"));
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgResponse);
    });

};
