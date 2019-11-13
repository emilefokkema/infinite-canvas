import { StateChange } from "./state-change";
import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
import { ClippedPaths } from "../instructions/clipped-paths";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import {lineDashesAreEqual} from "./line-dashes-are-equal";
import {Rectangle} from "../rectangle";
import {ChainableStateChange} from "./chainable-state-change";

export class InfiniteCanvasStateInstance{
    constructor(
        public fillStyle: string | CanvasGradient | CanvasPattern,
        public lineWidth: number,
        public lineDash: number[],
        public strokeStyle: string | CanvasGradient | CanvasPattern,
        public lineDashOffset: number,
        public transformation: Transformation,
        public clippedPaths: ClippedPaths
    ){

    }
    private noStateChange(): StateChange<InfiniteCanvasStateInstance>{
        return {
            newState: this,
            instruction: undefined
        };
    }
    public get clippingRegion(): Rectangle{return this.clippedPaths ? this.clippedPaths.area : undefined;}
    public equals(other: InfiniteCanvasStateInstance): boolean{
        return this.fillStyle === other.fillStyle &&
            this.lineWidth === other.lineWidth &&
            lineDashesAreEqual(this.lineDash, other.lineDash) &&
            this.strokeStyle === other.strokeStyle &&
            this.lineDashOffset === other.lineDashOffset &&
            this.transformation.equals(other.transformation) && (!this.clippedPaths && !other.clippedPaths || this.clippedPaths && this.clippedPaths.equals(other.clippedPaths));
    }
    public convertToState(other: InfiniteCanvasStateInstance): StateChange<InfiniteCanvasStateInstance>{
        const stateChangeWithoutClippedPaths: StateChange<InfiniteCanvasStateInstance> = new ChainableStateChange<InfiniteCanvasStateInstance>(this, [])
            .change(s => s.setFillStyle(other.fillStyle))
            .change(s => s.setLineWidth(other.lineWidth))
            .change(s => s.setLineDash(other.lineDash))
            .change(s => s.setStrokeStyle(other.strokeStyle))
            .change(s => s.setLineDashOffset(other.lineDashOffset))
            .change(s => s.setTransformation(other.transformation));
        return {
            newState: other,
            instruction: stateChangeWithoutClippedPaths.instruction
        }
    }

    public withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): InfiniteCanvasStateInstance{
        const newClippedPaths: ClippedPaths = this.clippedPaths ? this.clippedPaths.withClippedPath(clippedPath) : new ClippedPaths(clippedPath.getClippedArea(), clippedPath);
        return new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, newClippedPaths);
    }

    public setFillStyle(value: string | CanvasGradient | CanvasPattern): StateChange<InfiniteCanvasStateInstance>{
        if(value === this.fillStyle){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(value, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.lineWidth = transformation.scale * lineWidth;
            }
        }
    }

    public setLineDash(lineDash: number[]): StateChange<InfiniteCanvasStateInstance>{
        if(lineDashesAreEqual(this.lineDash, lineDash)){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, strokeStyle, this.lineDashOffset, this.transformation, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, lineDashOffset, this.transformation, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, newTransformation, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, givenTransformation, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {a, b, c, d, e, f} = transformation.inverse().before(givenTransformation).before(transformation);
                context.setTransform(a, b, c, d, e, f);
            }
        };
    }
    public static default: InfiniteCanvasStateInstance = new InfiniteCanvasStateInstance('#000', 1, [], "#000", 0, Transformation.identity, undefined);
    public static setDefault: Instruction = (context: CanvasRenderingContext2D, transformation: Transformation) => {
        context.lineWidth = transformation.scale;
    };
}