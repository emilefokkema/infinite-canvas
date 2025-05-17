export interface SingleCornerRadii{
    x: number
    y: number
    circular: boolean
}

export interface CornerRadii{
    upperLeft: SingleCornerRadii
    upperRight: SingleCornerRadii
    lowerLeft: SingleCornerRadii
    lowerRight: SingleCornerRadii
}

function isDomPointInit<T>(radii: DOMPointInit | Iterable<T>): radii is DOMPointInit{
    return (radii as DOMPointInit).x !== undefined;
}

function getSingleCornerRadii(radii: number | DOMPointInit): SingleCornerRadii | undefined{
    if(typeof radii === 'number'){
        if(Number.isNaN(radii)){
            return undefined;
        }
        if(radii < 0){
            throw new RangeError(`Radius value ${radii} is negative.`)
        }
        return {x: radii, y: radii, circular: true}
    }
    const {x, y} = radii;
    if(Number.isNaN(x) || Number.isNaN(y)){
        return undefined;
    }
    if(x < 0){
        throw new RangeError(`X-radius value ${radii} is negative.`)
    }
    if(y < 0){
        throw new RangeError(`Y-radius value ${radii} is negative.`)
    }
    return {x, y, circular: false};
}

function scaleSingleCornerRadii(radii: SingleCornerRadii, scale: number): SingleCornerRadii{
    const {x, y, circular} = radii;
    return {x: x * scale, y: y * scale, circular}
}

export function scaleCornerRadii(cornerRadii: CornerRadii, scale: number): CornerRadii{
    const { upperLeft, upperRight, lowerLeft, lowerRight } = cornerRadii;
    return {
        upperLeft: scaleSingleCornerRadii(upperLeft, scale),
        upperRight: scaleSingleCornerRadii(upperRight, scale),
        lowerLeft: scaleSingleCornerRadii(lowerLeft, scale),
        lowerRight: scaleSingleCornerRadii(lowerRight, scale)
    }
}

export function getCornerRadii(radii: number | DOMPointInit | Iterable<number | DOMPointInit>): CornerRadii | undefined{
    if(typeof radii === 'number' || isDomPointInit(radii)){
        const single = getSingleCornerRadii(radii);
        if(!single){
            return undefined;
        }
        return {upperLeft: single, upperRight: single, lowerLeft: single, lowerRight: single};
    }
    const radiiAsArray = [...radii];
    const singleRadii = radiiAsArray.slice(0, 4).map(getSingleCornerRadii);
    if(singleRadii.includes(undefined)){
        return undefined;
    }
    if(singleRadii.length === 4){
        const [upperLeft, upperRight, lowerRight, lowerLeft] = singleRadii;
        return {
            upperLeft,
            upperRight,
            lowerRight,
            lowerLeft
        };
    }
    if(singleRadii.length === 3){
        const [upperLeft, upperRightLowerLeft, lowerRight] = singleRadii;
        return {
            upperLeft,
            upperRight: upperRightLowerLeft,
            lowerRight,
            lowerLeft: upperRightLowerLeft
        };
    }
    if(singleRadii.length === 2){
        const [upperLeftLowerRight, upperRightLowerLeft] = singleRadii;
        return {
            upperLeft: upperLeftLowerRight,
            upperRight: upperRightLowerLeft,
            lowerRight: upperLeftLowerRight,
            lowerLeft: upperRightLowerLeft
        }
    }
    if(singleRadii.length === 1){
        const [single] = singleRadii;
        return {
            upperLeft: single,
            upperRight: single,
            lowerRight: single,
            lowerLeft: single
        }
    }
    throw new RangeError(`${radiiAsArray.length} radii provided. Between one and four radii are necessary.`)
}