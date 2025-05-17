export enum CornerOrientation{
    TOPLEFT,
    TOPRIGHT,
    BOTTOMLEFT,
    BOTTOMRIGHT
}

export function invertVertical(orientation: CornerOrientation): CornerOrientation{
    switch(orientation){
        case CornerOrientation.TOPLEFT: return CornerOrientation.BOTTOMLEFT;
        case CornerOrientation.TOPRIGHT: return CornerOrientation.BOTTOMRIGHT;
        case CornerOrientation.BOTTOMRIGHT: return CornerOrientation.TOPRIGHT;
        case CornerOrientation.BOTTOMLEFT: return CornerOrientation.TOPLEFT;
    }
}

export function invertHorizontal(orientation: CornerOrientation): CornerOrientation{
    switch(orientation){
        case CornerOrientation.TOPLEFT: return CornerOrientation.TOPRIGHT;
        case CornerOrientation.TOPRIGHT: return CornerOrientation.TOPLEFT;
        case CornerOrientation.BOTTOMRIGHT: return CornerOrientation.BOTTOMLEFT;
        case CornerOrientation.BOTTOMLEFT: return CornerOrientation.BOTTOMRIGHT;
    }
}