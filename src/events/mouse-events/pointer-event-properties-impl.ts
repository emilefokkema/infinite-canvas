import { PointerEventProperties } from "./pointer-event-properties";
import { MouseEventPropertiesImpl } from "./mouse-event-properties-impl";
import { TranslatableLocationData } from "../translatable-location-data";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Point } from "../../geometry/point";

export class PointerEventPropertiesImpl extends MouseEventPropertiesImpl implements PointerEventProperties, TranslatableLocationData<PointerEventPropertiesImpl>{
    constructor(
        offsetX: number,
        offsetY: number,
        movementX: number,
        movementY: number,
        public readonly width: number,
        public readonly height: number
    ){
        super(offsetX, offsetY, movementX, movementY);
    }
    public toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): PointerEventPropertiesImpl{
        const {offsetX, offsetY, movementX, movementY } = super.toInfiniteCanvasCoordinates(rectangle);
        const {x: width, y: height} = rectangle.infiniteCanvasContext.inverseBase.untranslated().apply(new Point(this.width, this.height));
        return new PointerEventPropertiesImpl(
            offsetX,
            offsetY,
            movementX,
            movementY,
            width,
            height
        );
    }
    public static create(ev: PointerEvent): PointerEventPropertiesImpl{
        const {offsetX, offsetY, movementX, movementY } = super.create(ev);
        return new PointerEventPropertiesImpl(
            offsetX,
            offsetY,
            movementX,
            movementY,
            ev.width,
            ev.height
        )
    }
}