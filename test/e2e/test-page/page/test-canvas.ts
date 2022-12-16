import { InfiniteCanvasOnE2ETestPage, EventListenerOnE2ETestPage } from "./interfaces";
import { EventMap } from '../shared/infinite-canvas-event-map';
import { WithFunctionsAsStrings } from "../utils";
import { EventListenerConfiguration } from "../shared/configuration";
import { InfiniteCanvas } from "../../../../src/api-surface/infinite-canvas";
import { AttachedEventListener } from './attached-event-listener';

export class TestCanvas implements InfiniteCanvasOnE2ETestPage{
    constructor(private readonly infCanvas: InfiniteCanvas){

    }
    public addEventListener<Type extends keyof EventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<EventMap, Type>>): EventListenerOnE2ETestPage<EventMap[Type]>{
        return new AttachedEventListener(this.infCanvas, config);
    }
}