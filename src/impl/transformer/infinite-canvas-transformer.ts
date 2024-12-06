import { Transformer } from "./transformer"
import { Anchor } from "./anchor";
import { Gesture } from "./gesture";
import { Rotate } from "./rotate";
import { Zoom } from "./zoom";
import { Config } from "../api-surface/config";
import { Transformation } from "../transformation";
import { Translate } from "./translate";
import { TranslateZoom } from "./translate-zoom";
import { TranslateRotateZoom } from "./translate-rotate-zoom";
import {ChangeMonitor} from "./change-monitor";
import {EventSource} from "../event-utils/event-source";
import { TransformerContext } from "./transformer-context";
import { Transformable } from "../transformable";


export class InfiniteCanvasTransformer implements Transformer, TransformerContext{
    private gesture: Gesture;
    private _zoom: Zoom;
    private _transformationChangeMonitor: ChangeMonitor<Transformation>;
    public get isTransforming(): boolean{return this._transformationChangeMonitor.changing;}
    constructor(private readonly viewBox: Transformable, private readonly config: Partial<Config>){
        this._transformationChangeMonitor = new ChangeMonitor<Transformation>((transformation: Transformation) => this.viewBox.transformation = transformation, 100);
    }
    public get transformationStart(): EventSource<void>{return this._transformationChangeMonitor.firstChange;}
    public get transformationChange(): EventSource<void>{return this._transformationChangeMonitor.subsequentChange;}
    public get transformationEnd(): EventSource<void>{return this._transformationChangeMonitor.changeEnd;}
    
    public get transformation(): Transformation{
        return this.viewBox.transformation;
    }
    public set transformation(value: Transformation){
        this._transformationChangeMonitor.setValue(value);
    }
    public getGestureForOneAnchor(anchor: Anchor): Gesture{
        return new Translate(anchor, this);
    }
    public getGestureForTwoAnchors(anchor1: Anchor, anchor2: Anchor): Gesture{
        if(this.config.rotationEnabled){
            return new TranslateRotateZoom(anchor1, anchor2, this);
        }
        return new TranslateZoom(anchor1, anchor2, this);
    }
    public releaseAnchor(anchor: Anchor): void{
        if(this.gesture){
            this.gesture = this.gesture.withoutAnchor(anchor);
        }
    }
    public zoom(x: number, y: number, scale: number): void{
        if(this._zoom){
            this._zoom.cancel();
        }
        this._zoom = new Zoom(this, x, y, scale, () => {
            this._zoom = undefined;
        });
    }
    public addRotationAnchor(anchor: Anchor): void{
        this.gesture = new Rotate(anchor, this);
    }
    public addAnchor(anchor: Anchor): void{
        if(!this.gesture){
            this.gesture = this.getGestureForOneAnchor(anchor);
            return;
        }
        const newGesture: Gesture = this.gesture.withAnchor(anchor);
        if(!newGesture){
            return undefined;
        }
        this.gesture = newGesture;
    }
}
