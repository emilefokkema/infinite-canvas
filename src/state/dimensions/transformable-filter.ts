import { CssLengthConverter } from "../../css-length-converter";
import { Point } from "../../geometry/point";
import { Transformation } from "../../transformation";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

interface TransformableFilterPart{
    stringRepresentation: string
    toTransformedString(coordinates: CanvasRectangle): string
    getShadowOffset(): Point | null
}

const numberPattern = '[+-]?(?:\\d*\\.)?\\d+(?:e[+-]?\\d+)?'
const zeroPattern = '[+-]?(?:0*\\.)?0+(?:e[+-]?\\d+)?'
const unitPattern = '(?:ch|em|ex|ic|rem|vh|vw|vmax|vmin|vb|vi|cqw|cqh|cqi|cqb|cqmin|cqmax|px|cm|mm|Q|in|pc|pt)'
const lengthPattern = `(?:${zeroPattern}|${numberPattern}${unitPattern})`
const blurPattern = `blur\\((${lengthPattern})\\)`;
const colorPattern = '[^())\\s]+(?:\\([^)]*?\\))?'
const dropShadowPattern = `drop-shadow\\((${lengthPattern})\\s+(${lengthPattern})\\s*?(?:(?:(${lengthPattern})\\s*?(${colorPattern})?)|(${colorPattern}))?\\)`
const transformableFilterPropertyPattern = `${blurPattern}|${dropShadowPattern}`;

function getNumberOfPixels(lengthPatternMatch: string, cssLengthConverter: CssLengthConverter): number{
    const lengthMatch = lengthPatternMatch.match(new RegExp(`(?:(${zeroPattern})|(${numberPattern})(${unitPattern}))`))
    if(lengthMatch[1]){
        return 0;
    }
    return cssLengthConverter.getNumberOfPixels(Number.parseFloat(lengthMatch[2]), lengthMatch[3]);
}

class TransformableFilterStringPart implements TransformableFilterPart{
    constructor(
        public readonly stringRepresentation: string,
        ){}
    public toTransformedString(): string{
        return this.stringRepresentation;
    }
    public getShadowOffset(): null {
        return null;
    }
}

class BlurFilter implements TransformableFilterPart{
    constructor(
        public readonly stringRepresentation: string,
        private readonly size: number){
    }
    public toTransformedString(coordinates: CanvasRectangle): string{
        const blurTranslation = coordinates.translateInfiniteCanvasContextTransformationToBitmapTransformation(Transformation.translation(this.size, 0))
        const transformedBlurRadius = blurTranslation.apply(Point.origin).mod();
        return `blur(${transformedBlurRadius}px)`
    }
    public getShadowOffset(): null {
        return null;
    }
    public static tryCreate(stringRepresentation: string, cssLengthConverter: CssLengthConverter): BlurFilter{
        const match = stringRepresentation.match(new RegExp(blurPattern))
        if(match === null){
            return null;
        }
        return new BlurFilter(stringRepresentation, getNumberOfPixels(match[1], cssLengthConverter));
    }
}

class DropShadowFilter implements TransformableFilterPart{
    constructor(
        public readonly stringRepresentation: string,
        private readonly offsetX: number,
        private readonly offsetY: number,
        private readonly blurRadius: number,
        private readonly color: string){
    }
    public toTransformedString(coordinates: CanvasRectangle): string{
        const bitmapTranslation = coordinates.translateInfiniteCanvasContextTransformationToBitmapTransformation(Transformation.translation(this.offsetX, this.offsetY));
        const {x: transformedOffsetX, y: transformedOffsetY} = bitmapTranslation.apply(Point.origin);
        if(this.blurRadius !== null){
            const blurTranslation = coordinates.translateInfiniteCanvasContextTransformationToBitmapTransformation(Transformation.translation(this.blurRadius, 0))
            const transformedBlurRadius = blurTranslation.apply(Point.origin).mod();
            if(this.color){
                return `drop-shadow(${transformedOffsetX}px ${transformedOffsetY}px ${transformedBlurRadius}px ${this.color})`
            }
            return `drop-shadow(${transformedOffsetX}px ${transformedOffsetY}px ${transformedBlurRadius}px)`
        }
        if(this.color){
            return `drop-shadow(${transformedOffsetX}px ${transformedOffsetY}px ${this.color})`
        }
        return `drop-shadow(${transformedOffsetX}px ${transformedOffsetY}px)`
    }
    public getShadowOffset(): Point {
        return new Point(this.offsetX, this.offsetY)
    }
    public static tryCreate(stringRepresentation: string, cssLengthConverter: CssLengthConverter): DropShadowFilter{
        const match = stringRepresentation.match(new RegExp(dropShadowPattern))
        if(match === null){
            return null;
        }
        if(match[5]){
            return new DropShadowFilter(
                stringRepresentation,
                getNumberOfPixels(match[1], cssLengthConverter),
                getNumberOfPixels(match[2], cssLengthConverter),
                null,
                match[5])
        }else if(match[4]){
            return new DropShadowFilter(
                stringRepresentation,
                getNumberOfPixels(match[1], cssLengthConverter),
                getNumberOfPixels(match[2], cssLengthConverter),
                getNumberOfPixels(match[3], cssLengthConverter),
                match[4]
            )
        }else if(match[3]){
            return new DropShadowFilter(
                stringRepresentation,
                getNumberOfPixels(match[1], cssLengthConverter),
                getNumberOfPixels(match[2], cssLengthConverter),
                getNumberOfPixels(match[3], cssLengthConverter),
                null
            )
        }else{
            return new DropShadowFilter(
                stringRepresentation,
                getNumberOfPixels(match[1], cssLengthConverter),
                getNumberOfPixels(match[2], cssLengthConverter),
                null,
                null
            )
        }
    }
}

export class TransformableFilter{
    private constructor(public readonly stringRepresentation: string, private readonly parts: TransformableFilterPart[]){

    }
    public static none: TransformableFilter = new TransformableFilter('none', [new TransformableFilterStringPart('none')])
    public toString(): string{
        return this.parts.map(p => p.stringRepresentation).join(' ');
    }
    public toTransformedString(coordinates: CanvasRectangle): string{
        return this.parts.map(p => p.toTransformedString(coordinates)).join(' ');
    }
    public getShadowOffset(): Point | null{
        for(const part of this.parts){
            const offset = part.getShadowOffset();
            if(offset !== null){
                return offset;
            }
        }
        return null;
    }
    public static create(stringRepresentation: string, cssLengthConverter: CssLengthConverter): TransformableFilter | null{
        const partMatches = stringRepresentation.match(new RegExp(`${transformableFilterPropertyPattern}|((?!\\s|${transformableFilterPropertyPattern}).)+`,'g'));
        const parts = partMatches.map(m => this.createPart(m, cssLengthConverter))
        return new TransformableFilter(stringRepresentation, parts);
    }
    private static createPart(match: string, cssLengthConverter: CssLengthConverter):TransformableFilterPart{
        let result: TransformableFilterPart = BlurFilter.tryCreate(match, cssLengthConverter);
        if(result !== null){
            return result;
        }
        result = DropShadowFilter.tryCreate(match, cssLengthConverter);
        if(result != null){
            return result;
        }
        return new TransformableFilterStringPart(match);
    }
}