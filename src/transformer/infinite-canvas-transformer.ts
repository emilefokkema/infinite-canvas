import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { InfiniteCanvasMovable } from "./infinite-canvas-movable";
import { Gesture } from "./gesture";
import { Rotate } from "./rotate";
import { Zoom } from "./zoom";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { TransformableBox } from "../interfaces/transformable-box";
import { Point } from "../geometry/point";
import { AnchorSet } from "../events/anchor-set";
import { Transformation } from "../transformation";
import { Translate } from "./translate";
import { TranslateZoom } from "./translate-zoom";
import { TranslateRotateZoom } from "./translate-rotate-zoom";
import { Movable } from "./movable";
import { Event } from "../custom-events/event";
import {ChangeMonitor} from "./change-monitor";


export class InfiniteCanvasTransformer implements Transformer{
    private gesture: Gesture;
    private anchorSet: AnchorSet;
    private _zoom: Zoom;
    private _transformationChangeMonitor: ChangeMonitor<Transformation>;
    public get isTransforming(): boolean{return this._transformationChangeMonitor.changing;}
    constructor(private readonly viewBox: TransformableBox, private readonly config: Partial<InfiniteCanvasConfig>){
        this.anchorSet = new AnchorSet();
        this._transformationChangeMonitor = new ChangeMonitor<Transformation>((transformation: Transformation) => this.viewBox.transformation = transformation, 100);
    }
    public get transformationStart(): Event<void>{return this._transformationChangeMonitor.firstChange;}
    public get transformationChange(): Event<void>{return this._transformationChangeMonitor.subsequentChange;}
    public get transformationEnd(): Event<void>{return this._transformationChangeMonitor.changeEnd;}
    
    public get transformation(): Transformation{
        return this.viewBox.transformation;
    }
    public set transformation(value: Transformation){
        this._transformationChangeMonitor.setValue(value);
    }
    public getGestureForOneMovable(movable: Movable): Gesture{
        return new Translate(movable, this);
    }
    public getGestureForTwoMovables(movable1: Movable, movable2: Movable): Gesture{
        if(this.config.rotationEnabled){
            return new TranslateRotateZoom(movable1, movable2, this);
        }
        return new TranslateZoom(movable1, movable2, this);
    }
    private createAnchorForMovable(movable: InfiniteCanvasMovable): Anchor{
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
    public createAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(existing){
            return;
        }
        const anchor: Anchor = this.getAnchor(x, y);
        this.anchorSet.addAnchor(anchor, externalIdentifier);
    }
    public createAnchor(x: number, y: number): number{
        const anchor: Anchor = this.getAnchor(x, y);
        return this.anchorSet.addAnchor(anchor);
    }
    public createRotationAnchor(x: number, y: number): number{
        const anchor: Anchor = this.getRotationAnchor(x, y);
        return this.anchorSet.addAnchor(anchor);
    }
    public moveAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(!existing){
            return;
        }
        existing.moveTo(x, y);
    }
    public moveAnchorByIdentifier(identifier: number, x: number, y: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByIdentifier(identifier);
        if(!existing){
            return;
        }
        existing.moveTo(x, y);
    }
    public releaseAnchorByExternalIdentifier(externalIdentifier: any): void{
        const existing: Anchor = this.anchorSet.getAnchorByExternalIdentifier(externalIdentifier);
        if(!existing){
            return;
        }
        existing.release();
        this.anchorSet.removeAnchorByExternalIdentifier(externalIdentifier);
    }
    public releaseAnchorByIdentifier(identifier: number): void{
        const existing: Anchor = this.anchorSet.getAnchorByIdentifier(identifier);
        if(!existing){
            return;
        }
        existing.release();
        this.anchorSet.removeAnchorByIdentifier(identifier);
    }
    public zoom(x: number, y: number, scale: number): void{
        if(this._zoom){
            this._zoom.cancel();
        }
        this._zoom = new Zoom(this, x, y, scale, () => {
            this._zoom = undefined;
        });
    }
    private getAnchor(x: number, y: number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable(new Point(x, y));
        if(!this.gesture){
            this.gesture = this.getGestureForOneMovable(movable);
            return this.createAnchorForMovable(movable);
        }
        const newGesture: Gesture = this.gesture.withMovable(movable);
        if(!newGesture){
            return undefined;
        }
        this.gesture = newGesture;
        return this.createAnchorForMovable(movable);
    }
    private getRotationAnchor(x: number, y:number): Anchor{
        const movable: InfiniteCanvasMovable = new InfiniteCanvasMovable(new Point(x, y));
        const rotate: Rotate = new Rotate(movable, this);
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
