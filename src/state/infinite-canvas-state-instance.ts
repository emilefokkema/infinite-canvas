import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
import { ClippedPaths } from "../instructions/clipped-paths";
import { StateInstanceProperties } from "./state-instance-properties";
import { allDimensions } from "./dimensions/all-dimensions";
import { Point } from "../geometry/point";
import { Area } from "../areas/area";
import { TransformableFilter } from "./dimensions/transformable-filter";
import { InstructionsToClip } from "../interfaces/instructions-to-clip";
import { StateInstanceDimension } from "./dimensions/state-instance-dimension";
import { sequence } from "../instruction-utils";

export class InfiniteCanvasStateInstance implements StateInstanceProperties{
    public readonly fillStyle: string | CanvasGradient | CanvasPattern;
    public readonly lineWidth: number;
    public readonly lineDash: number[];
    public readonly lineCap: CanvasLineCap;
    public readonly lineJoin: CanvasLineJoin;
    public readonly miterLimit: number;
    public readonly globalAlpha: number;
    public readonly globalCompositeOperation: GlobalCompositeOperation;
    public readonly filter: TransformableFilter;
    public readonly strokeStyle: string | CanvasGradient | CanvasPattern;
    public readonly lineDashOffset: number;
    public readonly transformation: Transformation;
    public readonly direction: CanvasDirection;
    public readonly imageSmoothingEnabled: boolean;
    public readonly imageSmoothingQuality: ImageSmoothingQuality;
    public readonly font: string;
    public readonly textAlign: CanvasTextAlign;
    public readonly textBaseline: CanvasTextBaseline;
    public readonly clippedPaths: ClippedPaths;
    public readonly fillAndStrokeStylesTransformed: boolean;
    public readonly shadowOffset: Point;
    public readonly shadowColor: string;
    public readonly shadowBlur: number;
    constructor(
        props: StateInstanceProperties
    ){
        this.fillStyle = props.fillStyle;
        this.lineWidth = props.lineWidth;
        this.lineCap = props.lineCap;
        this.lineJoin = props.lineJoin;
        this.lineDash = props.lineDash;
        this.miterLimit = props.miterLimit;
        this.globalAlpha = props.globalAlpha;
        this.globalCompositeOperation = props.globalCompositeOperation;
        this.filter = props.filter;
        this.strokeStyle = props.strokeStyle;
        this.lineDashOffset = props.lineDashOffset;
        this.transformation = props.transformation;
        this.direction = props.direction;
        this.imageSmoothingEnabled = props.imageSmoothingEnabled;
        this.imageSmoothingQuality = props.imageSmoothingQuality;
        this.font = props.font;
        this.textAlign = props.textAlign;
        this.textBaseline = props.textBaseline;
        this.clippedPaths = props.clippedPaths;
        this.fillAndStrokeStylesTransformed = props.fillAndStrokeStylesTransformed;
        this.shadowOffset = props.shadowOffset;
        this.shadowColor = props.shadowColor;
        this.shadowBlur = props.shadowBlur;
    }
    public changeProperty<K extends keyof StateInstanceProperties>(property: K, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance{
        const {fillStyle,
            lineWidth,
            lineDash,
            lineCap,
            lineJoin,
            miterLimit,
            globalAlpha,
            globalCompositeOperation,
            filter,
            strokeStyle,
            lineDashOffset,
            transformation,
            direction,
            imageSmoothingEnabled,
            imageSmoothingQuality,
            font,
            textAlign,
            textBaseline,
            clippedPaths,
            fillAndStrokeStylesTransformed,
            shadowOffset,
            shadowColor,
            shadowBlur} = this;
        const newProps: StateInstanceProperties = {
            fillStyle,
            lineWidth,
            lineDash,
            lineCap,
            lineJoin,
            miterLimit,
            globalAlpha,
            globalCompositeOperation,
            filter,
            strokeStyle,
            lineDashOffset,
            transformation,
            direction,
            imageSmoothingEnabled,
            imageSmoothingQuality,
            font,
            textAlign,
            textBaseline,
            clippedPaths,
            fillAndStrokeStylesTransformed,
            shadowOffset,
            shadowColor,
            shadowBlur
        };
        newProps[property] = newValue;
        return new InfiniteCanvasStateInstance(newProps);
    }
    public get clippingRegion(): Area{return this.clippedPaths ? this.clippedPaths.area : undefined;}
    public equals(other: InfiniteCanvasStateInstance): boolean{
        for(let dimension of allDimensions){
            if(!dimension.isEqualForInstances(this, other)){
                return false;
            }
        }

        return (!this.clippedPaths && !other.clippedPaths || this.clippedPaths && this.clippedPaths === other.clippedPaths) && this.fillAndStrokeStylesTransformed === other.fillAndStrokeStylesTransformed;
    }
    public getMaximumLineWidth(): number{
        return this.lineWidth * this.transformation.getMaximumLineWidthScale();
    }
    public getLineDashPeriod(): number{
        return this.lineDash.reduce((total, s2) => total + s2, 0);
    }
    public isTransformable(): boolean{
        for(let dimension of allDimensions){
            if(!dimension.valueIsTransformableForInstance(this)){
                return false;
            }
        }
        return true;
    }
    public getShadowOffsets(): Point[]{
        const result: Point[] = [];
        const filterShadowOffset = this.filter.getShadowOffset();
        if(filterShadowOffset !== null){
            result.push(filterShadowOffset)
        }
        if(!this.shadowOffset.equals(Point.origin)){
            result.push(this.shadowOffset)
        }
        return result;
    }

    public getInstructionToConvertToState(other: InfiniteCanvasStateInstance): Instruction{
        return this.getInstructionToConvertToStateOnDimensions(other, allDimensions);
    }

    public withClippedPath(clippedPath: InstructionsToClip): InfiniteCanvasStateInstance{
        const newClippedPaths: ClippedPaths = this.clippedPaths ? this.clippedPaths.withClippedPath(clippedPath) : new ClippedPaths(clippedPath.area, clippedPath);
        return this.changeProperty("clippedPaths", newClippedPaths);
    }

    public getInstructionToConvertToStateOnDimensions<
        TInstruction extends Instruction,
        TDimension extends StateInstanceDimension<TInstruction>>(other: InfiniteCanvasStateInstance, dimensions: TDimension[]): TInstruction{
            const instructions: TInstruction[] = dimensions.map(d => d.getInstructionToChange(this, other));
            return sequence(...instructions) as TInstruction
    }

    public static default: InfiniteCanvasStateInstance = new InfiniteCanvasStateInstance({
        fillStyle: '#000',
        lineWidth: 1,
        lineDash: [],
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10,
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        filter: TransformableFilter.none,
        strokeStyle: '#000',
        lineDashOffset: 0,
        transformation: Transformation.identity,
        direction: "inherit",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'low',
        font: "10px sans-serif",
        textAlign: "start",
        textBaseline: "alphabetic",
        clippedPaths: undefined,
        fillAndStrokeStylesTransformed: false,
        shadowOffset: Point.origin,
        shadowColor: 'rgba(0, 0, 0, 0)',
        shadowBlur: 0
    });
    public static setDefault: Instruction = () => {};
}
