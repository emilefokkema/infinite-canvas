import { MouseEventProperties } from "./mouse-event-properties";
import { TranslatableLocationData } from "../translatable-location-data";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Point } from "../../geometry/point";

export class MouseEventPropertiesImpl implements MouseEventProperties, TranslatableLocationData<MouseEventPropertiesImpl>{
    constructor(
        public readonly offsetX: number,
        public readonly offsetY: number,
        public readonly movementX: number,
        public readonly movementY: number){

    }
    public toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): MouseEventPropertiesImpl{
        const {x: offsetX, y: offsetY} = rectangle.inverseInfiniteCanvasContextBase.apply(new Point(this.offsetX, this.offsetY));
        const {x: movementX, y: movementY} = rectangle.inverseInfiniteCanvasContextBase.untranslated().apply(new Point(this.movementX, this.movementY));
        return new MouseEventPropertiesImpl(offsetX, offsetY, movementX, movementY);
    }
    public static create(ev: MouseEvent){
        return new MouseEventPropertiesImpl(ev.offsetX, ev.offsetY, ev.movementX, ev.movementY);
    }
}