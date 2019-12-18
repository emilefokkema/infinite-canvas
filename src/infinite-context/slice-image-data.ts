export function sliceImageData(sourceImageData: ImageData, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): ImageData{
    dirtyX = dirtyX === undefined ? 0 : dirtyX;
    dirtyY = dirtyY === undefined ? 0 : dirtyY;
    dirtyWidth = dirtyWidth === undefined ? sourceImageData.width : dirtyWidth;
    dirtyHeight = dirtyHeight === undefined ? sourceImageData.height : dirtyHeight;
    const oldArray: Uint8ClampedArray = sourceImageData.data;
    const newArray: Uint8ClampedArray = new Uint8ClampedArray(4 * dirtyWidth * dirtyHeight);
    for(let y: number = 0; y < dirtyHeight; y++){
        for(let x: number = 0; x < dirtyWidth; x++){
            const oldIndex: number = 4 * ((dirtyY + y) * sourceImageData.width + dirtyX + x);
            const newIndex: number = 4 * (y * dirtyWidth + x);
            newArray[newIndex] = oldArray[oldIndex];
            newArray[newIndex + 1] = oldArray[oldIndex + 1];
            newArray[newIndex + 2] = oldArray[oldIndex + 2];
            newArray[newIndex + 3] = oldArray[oldIndex + 3];
        }
    }
    return new ImageData(newArray, dirtyWidth, dirtyHeight);
}