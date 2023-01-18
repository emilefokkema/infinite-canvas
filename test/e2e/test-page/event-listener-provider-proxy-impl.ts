import { JSHandle } from "puppeteer";
import { EventListenerProviderOnE2eTestPage } from "./page/interfaces";
import { EventListenerProvider, EventListenerProxy } from "./proxies";
import { EventListenerConfiguration } from "./shared/configuration";
import { evaluate } from "./utils";
import { EventListenerProxyImpl } from "./event-listener-proxy-impl";

export abstract class EventListenerProviderProxyImpl<
    TEventMap,
    TEventListenerProviderProviderOnE2eTestPage extends EventListenerProviderOnE2eTestPage<TEventMap>> implements EventListenerProvider<TEventMap>{
    constructor(protected readonly handle: JSHandle<TEventListenerProviderProviderOnE2eTestPage>){

    }
    public async addEventListener<Type extends keyof TEventMap>(config: EventListenerConfiguration<TEventMap, Type>): Promise<EventListenerProxy<TEventMap[Type]>>{
        return new EventListenerProxyImpl(await evaluate(
            this.handle,
            (infCanvas, config) => infCanvas.addEventListener(config), config));
    }
}