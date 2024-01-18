import { StaticEventCollection } from './static-event-collection';
import { TransformationEventMap } from '../infinite-canvas-event-map';
import {InfiniteCanvasEventSource} from "../infinite-canvas-event-source";
import {Transformer} from "../../transformer/transformer";
import {representTransformation} from "../../transformer/represent-transformation";
import { RectangleManager } from '../../rectangle/rectangle-manager';
import { CanvasRectangle } from '../../rectangle/canvas-rectangle';
import { TransformationEvent } from '../../api-surface/transformation-event';
import { CustomEventImpl } from '../custom-event-impl';
import { TransformationRepresentation } from '../../api-surface/transformation-representation';
import { InfiniteCanvas } from '../../api-surface/infinite-canvas';
import { PreventableDefault } from '../preventable-default/preventable-default';
import { SimpleInternalEvent } from '../internal-events/simple-internal-event';

class InfiniteCanvasTransformationEventImpl extends CustomEventImpl implements TransformationEvent{
    public transformation: TransformationRepresentation;
    public inverseTransformation: TransformationRepresentation;
    constructor(transformationEvent: CanvasTransformationEvent, preventableDefault: PreventableDefault, type: string){
        super(transformationEvent, preventableDefault, type);
        this.transformation = transformationEvent.transformation;
        this.inverseTransformation = transformationEvent.inverseTransformation;
    }

}

class CanvasTransformationEvent extends SimpleInternalEvent<TransformationEvent>{
    public transformation: TransformationRepresentation;
    public inverseTransformation: TransformationRepresentation;
    constructor(private readonly type: string) {
        super(false);
    }
    protected createResultEvent(rectangle: CanvasRectangle): TransformationEvent{
        this.transformation = representTransformation(rectangle.infiniteCanvasContext.inverseBase);
        this.inverseTransformation = representTransformation(rectangle.infiniteCanvasContext.base);
        return new InfiniteCanvasTransformationEventImpl(this, this.preventableDefault, this.type);
    }
}

export class TransformationEventCollection extends StaticEventCollection<TransformationEventMap>{
    constructor(
        private readonly transformer: Transformer,
        rectangleManager: RectangleManager,
        infiniteCanvas: InfiniteCanvas){
        super(rectangleManager, infiniteCanvas);
    }
    protected createEvents(): {[K in keyof TransformationEventMap]: InfiniteCanvasEventSource<TransformationEventMap[K]>}{
        return {
            transformationstart: this.map(this.transformer.transformationStart, () => new CanvasTransformationEvent('transformationstart')),
            transformationchange: this.map(this.transformer.transformationChange, () => new CanvasTransformationEvent('transformationchange')),
            transformationend: this.map(this.transformer.transformationEnd, () => new CanvasTransformationEvent('transformationend')),
        };
    }
}
