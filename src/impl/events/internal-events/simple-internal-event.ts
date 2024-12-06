import { MappableInternalEventImpl } from "./mappable-internal-event-impl";
import { InfiniteCanvasPreventableDefault } from "../preventable-default/infinite-canvas-preventable-default";
import { NormalPreventableDefault } from "../preventable-default/normal-preventable-default";
import { PreventableDefault } from "../preventable-default/preventable-default";

export abstract class SimpleInternalEvent<TResultEvent extends Event> extends MappableInternalEventImpl<TResultEvent, PreventableDefault>{
    constructor(defaultBehavior: boolean){
        super(defaultBehavior ? new InfiniteCanvasPreventableDefault() : new NormalPreventableDefault());
    }
}