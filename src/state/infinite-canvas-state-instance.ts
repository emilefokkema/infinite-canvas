import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
import { ClippedPaths } from "../instructions/clipped-paths";
import { StateInstanceProperties } from "./state-instance-properties";
import { allDimensions } from "./dimensions/all-dimensions";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import { Point } from "../geometry/point";
import { Area } from "../areas/area";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class InfiniteCanvasStateInstance implements StateInstanceProperties{
    public readonly fillStyle: string | CanvasGradient | CanvasPattern;
    public readonly lineWidth: number;
    public readonly lineDash: number[];
    public readonly strokeStyle: string | CanvasGradient | CanvasPattern;
    public readonly lineDashOffset: number;
    public readonly transformation: Transformation;
    public readonly direction: CanvasDirection;
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
        this.lineDash = props.lineDash;
        this.strokeStyle = props.strokeStyle;
        this.lineDashOffset = props.lineDashOffset;
        this.transformation = props.transformation;
        this.direction = props.direction;
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
            strokeStyle,
            lineDashOffset,
            transformation,
            direction,
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
            strokeStyle,
            lineDashOffset,
            transformation,
            direction,
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

    public getInstructionToConvertToState(other: InfiniteCanvasStateInstance, rectangle: CanvasRectangle): Instruction{
        const instructions: Instruction[] = allDimensions.map(d => d.getInstructionToChange(this, other, rectangle));
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            for(let i: number = 0; i< instructions.length; i++){
                instructions[i](context, transformation);
            }
        };
    }

    public withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPath): InfiniteCanvasStateInstance{
        const newClippedPaths: ClippedPaths = this.clippedPaths ? this.clippedPaths.withClippedPath(clippedPath) : new ClippedPaths(clippedPath.getClippedArea(), clippedPath);
        return this.changeProperty("clippedPaths", newClippedPaths);
    }

    public static default: InfiniteCanvasStateInstance = new InfiniteCanvasStateInstance({
        fillStyle: '#000',
        lineWidth: 1,
        lineDash: [],
        strokeStyle: '#000',
        lineDashOffset: 0,
        transformation: Transformation.identity,
        direction: "inherit",
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
