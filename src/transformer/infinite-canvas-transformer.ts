import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { InfiniteCanvasMovable } from "./infinite-canvas-movable";
import { Gesture } from "./gesture";
import { InfiniteCanvasTransformerContext } from "./infinite-canvas-transformer-context";
import { Rotate } from "./rotate";
import { ViewBox } from "../interfaces/viewbox";
import { Zoom } from "./zoom";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";


export class InfiniteCanvasTransformer implements Transformer{
    private gesture: Gesture;
    private context: InfiniteCanvasTransformerContext;
    private _zoom: Zoom;
    constructor(private readonly viewBox: ViewBox, config: InfiniteCanvasConfig){
        this.context = new InfiniteCanvasTransformerContext(viewBox, config);
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
        if(this._zoom){
            this._zoom.cancel();
        }
        this._zoom = new Zoom(this.viewBox, x, y, scale, () => this._zoom = undefined);
    }
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