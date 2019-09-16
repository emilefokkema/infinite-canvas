import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { InfiniteCanvasMovable } from "./infinite-canvas-movable";
import { Gesture } from "./gesture";
import { InfiniteCanvasTransformerContext } from "./infinite-canvas-transformer-context";
import { Transformable } from "../transformable";
import { Transformation } from "../transformation";
import { Rotate } from "./rotate";
import { ViewBox } from "../viewbox";


export class InfiniteCanvasTransformer implements Transformer{
    private gesture: Gesture;
    private context: InfiniteCanvasTransformerContext;
    constructor(private readonly viewBox: ViewBox){
        this.context = new InfiniteCanvasTransformerContext(viewBox);
    }
    private createAnchor(movable: InfiniteCanvasMovable): Anchor{
        const self: InfiniteCanvasTransformer = this;
        return {
            moveTo(x: number, y: number){
                movable.moveTo(x,y);
            },
            release(){
                self.gesture = self.gesture.withoutMovable(movable);
            }
        };
    }
    public zoom(x: number, y: number, scale: number): void{
        this.viewBox.transformation = this.viewBox.transformation.before(Transformation.zoom(x, y, scale));
    }
    public get rotationEnabled(): boolean{return this.context.rotationEnabled};
    public set rotationEnabled(value: boolean){this.context.rotationEnabled = value;}
    public getAnchor(x: number, y: number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable({x,y});
        if(!this.gesture){
            this.gesture = this.context.getGestureForOneMovable(movable);
            return this.createAnchor(movable);
        }
        const newGesture: Gesture = this.gesture.withMovable(movable);
        if(!newGesture){
            return undefined;
        }
        this.gesture = newGesture;
        return this.createAnchor(movable);
    }
    public getRotationAnchor(x: number, y:number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable({x,y});
        const rotate: Rotate = new Rotate(movable, this.viewBox);
        return {
            moveTo(x: number, y: number){
                movable.moveTo(x,y);
            },
            release(){
                rotate.end();
            }
        };
    }
}