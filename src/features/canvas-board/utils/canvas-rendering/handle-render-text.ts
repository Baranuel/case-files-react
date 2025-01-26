const DEFAULT_FONT_FAMILY = 'sans-serif';

type TextOptions = {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    font: string;
    color: string;
}

export const handleRenderText = (ctx: CanvasRenderingContext2D, {x, y, width, height, text, font, color}: TextOptions) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const fontSize = parseInt(font.split(' ')[1].split('px')[0]);

    const lines = text.split(' ').reduce((acc: string[], word) => {
        const lastLine = acc[acc.length - 1] || '';
        const testLine = lastLine ? `${lastLine} ${word}` : word;
        
        if (!lastLine || ctx.measureText(testLine).width <= width) {
            if (acc.length) acc[acc.length - 1] = testLine;
            else acc.push(testLine);
        } else {
            acc.push(word);
        }
        return acc;
    }, []);
    
    const lineHeight = fontSize; // Add some spacing between lines
    let currentY = y - ((lines.length * lineHeight) / 2); // Center text vertically

    for (const line of lines) {
        if (currentY + lineHeight >= y + height) break;
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
    }

    ctx.restore();
}