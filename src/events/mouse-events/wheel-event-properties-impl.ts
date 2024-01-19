import { MouseEventPropertiesImpl } from "./mouse-event-properties-impl";
import { WheelEventProperties } from "./wheel-event-properties";
import { TranslatableLocationData } from "../translatable-location-data";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Point } from "../../geometry/point";

export class WheelEventPropertiesImpl extends MouseEventPropertiesImpl implements WheelEventProperties, TranslatableLocationData<WheelEventPropertiesImpl>{
    constructor(
        offsetX: number,
        offsetY: number,
        movementX: number,
        movementY: number,
        public readonly deltaX: number,
        public readonly deltaY: number){
            super(offsetX, offsetY, movementX, movementY);
    }
    public toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): WheelEventPropertiesImpl{
        const {offsetX, offsetY, movementX, movementY } = super.toInfiniteCanvasCoordinates(rectangle);
        const {x: deltaX, y: deltaY} = rectangle.infiniteCanvasContext.inverseBase.untranslated().apply(new Point(this.deltaX, this.deltaY));
        return new WheelEventPropertiesImpl(
            offsetX,
            offsetY,
            movementX,
            movementY,
            deltaX,
            deltaY
        )
    }
    public static create(ev: WheelEvent): WheelEventPropertiesImpl{
        const {offsetX, offsetY, movementX, movementY } = super.create(ev);
        return new WheelEventPropertiesImpl(
            offsetX,
            offsetY,
            movementX,
            movementY,
            ev.deltaX,
            ev.deltaY
        )
    }
}