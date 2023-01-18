import { StaticEventCollection } from './static-event-collection';
import { DrawEvent } from '../../api-surface/draw-event';
import {InfiniteCanvasEventSource} from "../infinite-canvas-event-source";
import { DrawingIterationProviderWithCallback } from "../../drawing-iteration-provider-with-callback";
import {representTransformation} from "../../transformer/represent-transformation";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { CustomEventImpl } from '../custom-event-impl';
import { TransformationRepresentation } from '../../api-surface/transformation-representation';
import {DrawEventMap} from "../infinite-canvas-event-map";
import { InfiniteCanvas } from '../../api-surface/infinite-canvas';
import { PreventableDefault } from '../preventable-default/preventable-default';
import { SimpleInternalEvent } from '../internal-events/simple-internal-event';

class InfiniteCanvasDrawEventImpl extends CustomEventImpl implements DrawEvent{
    public transformation: TransformationRepresentation;
    public inverseTransformation: TransformationRepresentation;
    constructor(transformationEvent: CanvasDrawEvent, preventableDefault: PreventableDefault){
        super(transformationEvent, preventableDefault, 'draw');
        this.transformation = transformationEvent.transformation;
        this.inverseTransformation = transformationEvent.inverseTransformation;
    }
}

class CanvasDrawEvent extends SimpleInternalEvent<DrawEvent>{
    public transformation: TransformationRepresentation;
    public inverseTransformation: TransformationRepresentation;
    constructor(){
        super(false);
    }
    protected createResultEvent(rectangle: CanvasRectangle): DrawEvent{
        this.transformation = representTransformation(rectangle.inverseInfiniteCanvasContextBase);
        this.inverseTransformation = representTransformation(rectangle.infiniteCanvasContextBase);
        return new InfiniteCanvasDrawEventImpl(this, this.preventableDefault);
    }
}

export class DrawEventCollection extends StaticEventCollection<DrawEventMap>{
    constructor(
        private readonly drawingIterationProvider: DrawingIterationProviderWithCallback,
        rectangle: CanvasRectangle,
        infiniteCanvas: InfiniteCanvas){
        super(rectangle, infiniteCanvas);
    }
    protected createEvents(): {[K in keyof DrawEventMap]: InfiniteCanvasEventSource<DrawEventMap[K]>}{
        return {
            draw: this.map(this.drawingIterationProvider.drawHappened, () => new CanvasDrawEvent())
        };
    }
}
