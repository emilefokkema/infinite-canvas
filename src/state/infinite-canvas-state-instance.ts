import { StateChange } from "./state-change";
import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
import { ChainableStateChange } from "./chainable-state-change";

export class InfiniteCanvasStateInstance {
    constructor(
        public fillStyle: string | CanvasGradient | CanvasPattern,
        public lineWidth: number,
        public lineDash: number[],
        public strokeStyle: string | CanvasGradient | CanvasPattern,
        public lineDashOffset: number,
        public transformation: Transformation
    ){}
    private noStateChange(): StateChange<InfiniteCanvasStateInstance>{
        return {
            newState: this,
            instruction: undefined
        };
    }
    private static lineDashesAreEqual(one: number[], other: number[]): boolean{
        if(one.length !== other.length){
            return false;
        }
        for(let i=0; i<one.length;i++){
            if(one[i] !== other[i]){
                return false;
            }
        }
        return true;
    }

    public convertToState(other: InfiniteCanvasStateInstance): StateChange<InfiniteCanvasStateInstance>{
        return new ChainableStateChange<InfiniteCanvasStateInstance>(this, [])
            .change(s => s.setFillStyle(other.fillStyle))
            .change(s => s.setLineWidth(other.lineWidth))
            .change(s => s.setLineDash(other.lineDash))
            .change(s => s.setStrokeStyle(other.strokeStyle))
            .change(s => s.setLineDashOffset(other.lineDashOffset))
            .change(s => s.setTransformation(other.transformation));
    }

    public equals(other: InfiniteCanvasStateInstance): boolean{
        return this.fillStyle === other.fillStyle &&
               this.lineWidth === other.lineWidth &&
               InfiniteCanvasStateInstance.lineDashesAreEqual(this.lineDash, other.lineDash) &&
               this.strokeStyle === other.strokeStyle &&
               this.lineDashOffset === other.lineDashOffset &&
               this.transformation.equals(other.transformation);
    }

    public setFillStyle(value: string | CanvasGradient | CanvasPattern): StateChange<InfiniteCanvasStateInstance>{
        if(value === this.fillStyle){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(value, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.fillStyle = value;
            }
        };
    }

    public setLineWidth(lineWidth: number): StateChange<InfiniteCanvasStateInstance>{
        if(lineWidth === this.lineWidth){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.lineWidth = transformation.scale * lineWidth;
            }
        }
    }

    public setLineDash(lineDash: number[]): StateChange<InfiniteCanvasStateInstance>{
        if(InfiniteCanvasStateInstance.lineDashesAreEqual(this.lineDash, lineDash)){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, lineDash, this.strokeStyle, this.lineDashOffset, this.transformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.setLineDash(lineDash.map(d => d * transformation.scale));
            }
        };
    }

    public setStrokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern): StateChange<InfiniteCanvasStateInstance>{
        if(this.strokeStyle === strokeStyle){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, strokeStyle, this.lineDashOffset, this.transformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.strokeStyle = strokeStyle;
            }
        };
    }

    public setLineDashOffset(lineDashOffset: number): StateChange<InfiniteCanvasStateInstance>{
        if(this.lineDashOffset === lineDashOffset){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, lineDashOffset, this.transformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.lineDashOffset = lineDashOffset * transformation.scale;
            }
        }
    }

    public addTransformation(transformation: Transformation): StateChange<InfiniteCanvasStateInstance>{
        if(transformation.equals(Transformation.identity)){
            return this.noStateChange();
        }
        const newTransformation: Transformation = transformation.before(this.transformation);
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, newTransformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {a, b, c, d, e, f} = transformation.inverse().before(newTransformation).before(transformation);
                context.setTransform(a, b, c, d, e, f);
            }
        };
    }

    public setTransformation(givenTransformation: Transformation): StateChange<InfiniteCanvasStateInstance>{
        if(this.transformation.equals(givenTransformation)){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, givenTransformation),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {a, b, c, d, e, f} = transformation.inverse().before(givenTransformation).before(transformation);
                context.setTransform(a, b, c, d, e, f);
            }
        };
    }
    public static default: InfiniteCanvasStateInstance = new InfiniteCanvasStateInstance('#000', 1, [], "#000", 0, Transformation.identity);
    public static setDefault: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
        context.lineWidth = transformation.scale;
    };
}