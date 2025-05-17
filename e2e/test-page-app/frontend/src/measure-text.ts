export function measureText(
    canvas: {getContext(id: '2d'): CanvasRenderingContext2D},
    text: string
): TextMetrics{
    const {
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        width
    } = canvas.getContext('2d').measureText(text)
    return {
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        width
    };
}