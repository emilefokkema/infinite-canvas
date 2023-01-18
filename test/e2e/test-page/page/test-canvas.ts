import { InfiniteCanvasOnE2ETestPage, EventListenerOnE2ETestPage } from "./interfaces";
import { InfiniteCanvasEventMap } from '../shared/infinite-canvas-event-map';
import { WithFunctionsAsStrings } from "../utils";
import { EventListenerConfiguration } from "../shared/configuration";
import { InfiniteCanvas } from "../../../../src/api-surface/infinite-canvas";
import { AttachedEventListener } from './attached-event-listener';

export class TestCanvas implements InfiniteCanvasOnE2ETestPage{
    constructor(private readonly infCanvas: InfiniteCanvas){

    }
    public addEventListener<Type extends keyof InfiniteCanvasEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<InfiniteCanvasEventMap, Type>>): EventListenerOnE2ETestPage<InfiniteCanvasEventMap[Type]>{
        return new AttachedEventListener(this.infCanvas, config);
    }
}
