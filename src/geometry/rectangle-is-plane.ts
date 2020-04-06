function lineSegmentIsLine(start: number, length: number): boolean{
    if(Number.isFinite(start) || Number.isFinite(length)){
        return false;
    }
    return start < 0 && length > 0 || start > 0 && length < 0;
}

export function rectangleIsPlane(x: number, y: number, width: number, height: number): boolean{
    return lineSegmentIsLine(x, width) && lineSegmentIsLine(y, height);
}
