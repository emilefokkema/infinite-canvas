import { JSHandle } from "puppeteer";
import { InfiniteCanvasProxy, EventListenerProxy } from "./proxies";
import { InfiniteCanvasOnE2ETestPage } from "./page/interfaces";
import { EventListenerConfiguration } from "./shared/configuration";
import { EventMap } from "./shared/infinite-canvas-event-map";
import { evaluate } from "./utils";
import { DrawEvent } from "./shared/draw-event";
import { EventListenerProxyImpl } from "./event-listener-proxy-impl";

export class InfiniteCanvasProxyImpl implements InfiniteCanvasProxy{
    constructor(private readonly handle: JSHandle<InfiniteCanvasOnE2ETestPage>){

    }
    public async addEventListener<Type extends keyof EventMap>(config: EventListenerConfiguration<EventMap, Type>): Promise<EventListenerProxy<EventMap[Type]>>{
        return new EventListenerProxyImpl(await evaluate(
            this.handle,
            (infCanvas, config) => infCanvas.addEventListener(config), config));
    }
    public addDrawEventListener(debounceInterval?: number): Promise<EventListenerProxy<DrawEvent>>{
        return this.addEventListener({
            type: 'draw',
            shape: {
                transformation: {a:0,b:0,c:0,d:0,e:0,f:0},
                inverseTransformation: {a:0,b:0,c:0,d:0,e:0,f:0}
            },
            debounceInterval
        })
    }
}