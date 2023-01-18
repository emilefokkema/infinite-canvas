import { InfiniteCanvasTouch } from "../../api-surface/infinite-canvas-touch";
import { TouchProperties } from "./touch-properties";

export class TouchImpl implements InfiniteCanvasTouch{
    public readonly infiniteCanvasX: number;
    public readonly infiniteCanvasY: number;
    public readonly radiusX: number;
    public readonly radiusY: number;
    public readonly rotationAngle: number;
    constructor(private readonly touch: Touch, props: TouchProperties){
        this.infiniteCanvasX = props.x;
        this.infiniteCanvasY = props.y;
        this.radiusX = props.radiusX;
        this.radiusY = props.radiusY;
        this.rotationAngle = props.rotationAngle;
    }
    public get clientX(): number{return this.touch.clientX;}
    public get clientY(): number{return this.touch.clientY;}
    public get force(): number{return this.touch.force;}
    public get identifier(): number{return this.touch.identifier;}
    public get pageX(): number{return this.touch.pageX;}
    public get pageY(): number{return this.touch.pageY;}
    public get screenX(): number{return this.touch.screenX;}
    public get screenY(): number{return this.touch.screenY;}
    public get target(): EventTarget{return this.touch.target;}
}