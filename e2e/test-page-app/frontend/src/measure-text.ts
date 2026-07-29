export function measureText(
    canvas: {getContext(id: '2d'): CanvasRenderingContext2D},
    text: string
): TextMetrics{
    const {
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        alphabeticBaseline,
        emHeightAscent,
        emHeightDescent,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        hangingBaseline,
        ideographicBaseline,
        width
    } = canvas.getContext('2d').measureText(text)
    return {
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        alphabeticBaseline,
        emHeightAscent,
        emHeightDescent,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        hangingBaseline,
        ideographicBaseline,
        width
    };
}