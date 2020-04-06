function lineSegmentHasLength(start: number, length: number): boolean{
    if(Number.isFinite(start)){
        return true;
    }
    if(Number.isFinite(length)){
        return false;
    }
    return start < 0 && length > 0 || start > 0 && length < 0;
}

export function rectangleHasArea(x: number, y: number, width: number, height: number): boolean{
    return lineSegmentHasLength(x, width) && lineSegmentHasLength(y, height);
}
