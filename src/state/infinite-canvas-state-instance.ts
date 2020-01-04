import { StateChange } from "./state-change";
import { Transformation } from "../transformation";
import { Instruction } from "../instructions/instruction";
import { ClippedPaths } from "../instructions/clipped-paths";
import {StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState} from "../interfaces/state-changing-instruction-set-with-area-and-current-path";
import {lineDashesAreEqual} from "./line-dashes-are-equal";
import {Rectangle} from "../rectangle";
import {ChainableStateChange} from "./chainable-state-change";
import {InfiniteCanvasFillStrokeStyle} from "../infinite-canvas-fill-stroke-style";
import { InstructionBuilder } from "../instruction-builders/instruction-builder";

export class InfiniteCanvasStateInstance{
    constructor(
        public fillStyle: string | CanvasGradient | CanvasPattern,
        public lineWidth: number,
        public lineDash: number[],
        public strokeStyle: string | CanvasGradient | CanvasPattern,
        public lineDashOffset: number,
        public transformation: Transformation,
        public direction: CanvasDirection,
	    public font: string,
	    public textAlign: CanvasTextAlign,
	    public textBaseline: CanvasTextBaseline,
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
            this.transformation.equals(other.transformation) && 
            this.direction === other.direction &&
            this.font === other.font &&
            this.textAlign === other.textAlign &&
            this.textBaseline === other.textBaseline &&
            (!this.clippedPaths && !other.clippedPaths || this.clippedPaths && this.clippedPaths.equals(other.clippedPaths));
    }
    public convertToState(other: InfiniteCanvasStateInstance): StateChange<InfiniteCanvasStateInstance>{
        const stateChangeWithoutClippedPaths: StateChange<InfiniteCanvasStateInstance> = new ChainableStateChange<InfiniteCanvasStateInstance>(this, [])
            .change(s => s.setFillStyle(other.fillStyle))
            .change(s => s.setLineWidth(other.lineWidth))
            .change(s => s.setLineDash(other.lineDash))
            .change(s => s.setStrokeStyle(other.strokeStyle))
            .change(s => s.setLineDashOffset(other.lineDashOffset))
            .change(s => s.setTransformation(other.transformation))
            .change(s => s.setDirection(other.direction))
            .change(s => s.setFont(other.font))
            .change(s => s.setTextAlign(other.textAlign))
            .change(s => s.setTextBaseline(other.textBaseline));
        return {
            newState: other,
            instruction: stateChangeWithoutClippedPaths.instruction
        }
    }

    public withClippedPath(clippedPath: StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState): InfiniteCanvasStateInstance{
        const newClippedPaths: ClippedPaths = this.clippedPaths ? this.clippedPaths.withClippedPath(clippedPath) : new ClippedPaths(clippedPath.getClippedArea(), clippedPath);
        return new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, newClippedPaths);
    }

    private getFillStrokeStyleSettingInstruction(fillStrokeStyle: string | CanvasGradient | CanvasPattern, setFillStrokeStyle: (context: CanvasRenderingContext2D, fillStrokeStyle: string | CanvasGradient | CanvasPattern) => void): Instruction{
        if(fillStrokeStyle instanceof InfiniteCanvasFillStrokeStyle){
            return () => {};
        }else{
            return (context: CanvasRenderingContext2D) => {
                setFillStrokeStyle(context, fillStrokeStyle);
            }
        }
    }

    public setFillStyle(value: string | CanvasGradient | CanvasPattern): StateChange<InfiniteCanvasStateInstance>{
        if(value === this.fillStyle){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(value, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: this.getFillStrokeStyleSettingInstruction(value, (context, style) => context.fillStyle = style)
        };
    }

    public setStrokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern): StateChange<InfiniteCanvasStateInstance>{
        if(this.strokeStyle === strokeStyle){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: this.getFillStrokeStyleSettingInstruction(strokeStyle, (context, style) => context.strokeStyle = style)
        };
    }

    public setLineWidth(lineWidth: number): StateChange<InfiniteCanvasStateInstance>{
        if(lineWidth === this.lineWidth){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: () => {}
        }
    }

    public setLineDash(lineDash: number[]): StateChange<InfiniteCanvasStateInstance>{
        if(lineDashesAreEqual(this.lineDash, lineDash)){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: () => {}
        };
    }

    public setLineDashOffset(lineDashOffset: number): StateChange<InfiniteCanvasStateInstance>{
        if(this.lineDashOffset === lineDashOffset){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: () => {}
        }
    }

    public setDirection(direction: CanvasDirection): StateChange<InfiniteCanvasStateInstance>{
        if(this.direction === direction){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D) => {
                context.direction = direction;
            }
        }
    }

    public setFont(font: string): StateChange<InfiniteCanvasStateInstance>{
        if(this.font === font){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D) => {
                context.font = font;
            }
        }
    }

    public setTextAlign(textAlign: CanvasTextAlign): StateChange<InfiniteCanvasStateInstance>{
        if(this.textAlign === textAlign){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, textAlign, this.textBaseline, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D) => {
                context.textAlign = textAlign;
            }
        }
    }

    public setTextBaseline(textBaseline: CanvasTextBaseline): StateChange<InfiniteCanvasStateInstance>{
        if(this.textBaseline === textBaseline){
            return this.noStateChange();
        }
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, this.transformation, this.direction, this.font, this.textAlign, textBaseline, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D) => {
                context.textBaseline = textBaseline;
            }
        }
    }

    public getInstructionToapplyCurrentLineWidthLineDashAndLineDashOffset(transform: boolean): Instruction{
        if(transform){
            return (context: CanvasRenderingContext2D, transformation: Transformation) => {
                context.lineWidth = this.lineWidth * transformation.scale;
                context.setLineDash(this.lineDash.map(d => d * transformation.scale));
                context.lineDashOffset = this.lineDashOffset * transformation.scale;
            };
        }
        return (context: CanvasRenderingContext2D) => {
            context.lineWidth = this.lineWidth ;
            context.setLineDash(this.lineDash);
            context.lineDashOffset = this.lineDashOffset;
        };
    }

    public applyToStrokingInstruction(strokingInstruction: Instruction, transform: boolean): Instruction{
        const builder: InstructionBuilder = new InstructionBuilder(strokingInstruction);
		if(this.strokeStyle instanceof InfiniteCanvasFillStrokeStyle){
			this.strokeStyle.applyToDrawingInstruction(builder, (context: CanvasRenderingContext2D, fillOrStrokeStyle: string | CanvasGradient | CanvasPattern) => context.strokeStyle = fillOrStrokeStyle, transform);
		}
		builder.prepend(this.getInstructionToapplyCurrentLineWidthLineDashAndLineDashOffset(transform));
		return builder.build();
    }

    public applyToFillingInstruction(fillingInstruction: Instruction, transform: boolean): Instruction{
        const builder: InstructionBuilder = new InstructionBuilder(fillingInstruction);
		if(this.fillStyle instanceof InfiniteCanvasFillStrokeStyle){
			this.fillStyle.applyToDrawingInstruction(builder, (context: CanvasRenderingContext2D, fillOrStrokeStyle: string | CanvasGradient | CanvasPattern) => context.fillStyle = fillOrStrokeStyle, transform);
		}
		return builder.build();
    }

    public addTransformation(transformation: Transformation): StateChange<InfiniteCanvasStateInstance>{
        if(transformation.equals(Transformation.identity)){
            return this.noStateChange();
        }
        const newTransformation: Transformation = transformation.before(this.transformation);
        return {
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, newTransformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
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
            newState: new InfiniteCanvasStateInstance(this.fillStyle, this.lineWidth, this.lineDash, this.strokeStyle, this.lineDashOffset, givenTransformation, this.direction, this.font, this.textAlign, this.textBaseline, this.clippedPaths),
            instruction: (context: CanvasRenderingContext2D, transformation: Transformation) => {
                const {a, b, c, d, e, f} = transformation.inverse().before(givenTransformation).before(transformation);
                context.setTransform(a, b, c, d, e, f);
            }
        };
    }
    public static default: InfiniteCanvasStateInstance = new InfiniteCanvasStateInstance('#000', 1, [], "#000", 0, Transformation.identity, "inherit", "10px sans-serif", "start", "alphabetic", undefined);
    public static setDefault: Instruction = () => {};
}