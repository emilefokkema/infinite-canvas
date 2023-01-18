import { TouchEventProperties } from "./touch-event-properties";
import { TranslatableLocationData } from "../translatable-location-data";
import { TouchProperties } from "./touch-properties";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Point } from "../../geometry/point";

class TouchPropertiesImpl implements TouchProperties, TranslatableLocationData<TouchPropertiesImpl>{
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly radiusX: number,
        public readonly radiusY: number,
        public readonly rotationAngle: number,
        public readonly identifier: number
    ){

    }
    public toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): TouchPropertiesImpl{
        const transformation = rectangle.inverseInfiniteCanvasContextBase;
        const {x, y} = transformation.apply(new Point(this.x, this.y));
        const radiusX = this.radiusX * transformation.scale;
        const radiusY = this.radiusY * transformation.scale;
        const rotationAngle = this.rotationAngle + transformation.getRotationAngle();
        return new TouchPropertiesImpl(
            x,
            y,
            radiusX,
            radiusY,
            rotationAngle,
            this.identifier
        )
    }
    public static create(touch: Touch, rectangle: CanvasRectangle): TouchPropertiesImpl{
        const {x, y} = rectangle.getCSSPosition(touch.clientX, touch.clientY);
        return new TouchPropertiesImpl(
            x,
            y,
            touch.radiusX,
            touch.radiusY,
            touch.rotationAngle,
            touch.identifier
        )
    }
}

class TouchPropertyRepository{
    private readonly translatedProps: TouchPropertiesImpl[] = [];
    private readonly createdProps: TouchPropertiesImpl[] = [];
    public toInfiniteCanvasCoordinates(props: TouchPropertiesImpl, rectangle: CanvasRectangle): TouchPropertiesImpl{
        let translatedProps = this.translatedProps.find(p => p.identifier === props.identifier);
        if(translatedProps){
            return translatedProps;
        }
        translatedProps = props.toInfiniteCanvasCoordinates(rectangle);
        this.translatedProps.push(translatedProps);
        return translatedProps;
    }
    public createProps(touch: Touch, rectangle: CanvasRectangle): TouchPropertiesImpl{
        let createdProps = this.createdProps.find(p => p.identifier === touch.identifier);
        if(createdProps){
            return createdProps;
        }
        createdProps = TouchPropertiesImpl.create(touch, rectangle);
        this.createdProps.push(createdProps);
        return createdProps;
    }
    public dispose(): void{
        this.translatedProps.splice(0, this.translatedProps.length);
        this.createdProps.splice(0, this.createdProps.length);
    }
}

export class TouchEventPropertiesImpl implements TouchEventProperties, TranslatableLocationData<TouchEventPropertiesImpl>{
    constructor(
        public readonly targetTouches: TouchPropertiesImpl[],
        public readonly changedTouches: TouchPropertiesImpl[],
        public readonly touches: TouchPropertiesImpl[]
    ){

    }
    public toInfiniteCanvasCoordinates(rectangle: CanvasRectangle): TouchEventPropertiesImpl{
        const repository = new TouchPropertyRepository();
        const result = new TouchEventPropertiesImpl(
            this.targetTouches.map(t => repository.toInfiniteCanvasCoordinates(t, rectangle)),
            this.changedTouches.map(t => repository.toInfiniteCanvasCoordinates(t, rectangle)),
            this.touches.map(t => repository.toInfiniteCanvasCoordinates(t, rectangle)),
        );
        repository.dispose();
        return result;
    }
    public static create(rectangle: CanvasRectangle, touches: Touch[], changedTouches: Touch[]): TouchEventPropertiesImpl{
        const repository = new TouchPropertyRepository();
        const targetTouchesProps = touches.map(t => repository.createProps(t, rectangle));
        const changedTouchesProps = changedTouches.map(t => repository.createProps(t, rectangle));
        repository.dispose();
        return new TouchEventPropertiesImpl(
            targetTouchesProps,
            changedTouchesProps,
            targetTouchesProps
        )
    }
}