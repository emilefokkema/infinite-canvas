import { ElementEventMap } from './shared/element-event-map';
import { EventListenerProviderProxyImpl } from './event-listener-provider-proxy-impl';
import { CanvasElementOnE2eTestPage } from './page/interfaces';
import { CanvasElementProxy, InfiniteCanvasProxy, EventListenerProxy } from './proxies';
import { InfiniteCanvasE2EInitialization } from './shared/configuration';
import { evaluate } from './utils';
import { InfiniteCanvasProxyImpl } from './infinite-canvas-proxy-impl';
import { MouseEventShape, mouseEventShape } from './shared/mouse-event-shape';
import { MouseEventMap } from './shared/maps';
import { ElementHandle } from 'puppeteer';


export class CanvasElementProxyImpl extends EventListenerProviderProxyImpl<ElementEventMap, CanvasElementOnE2eTestPage> implements CanvasElementProxy{

    public async initializeInfiniteCanvas(initialization: InfiniteCanvasE2EInitialization): Promise<InfiniteCanvasProxy>{
        const handle = await evaluate(this.handle, (h, initialization) => h.initializeInfiniteCanvas(initialization), initialization);
        return new InfiniteCanvasProxyImpl(handle);
    }
    public async setAttribute(name: string, value: string): Promise<void>{
        await evaluate(this.handle, (h, name, value) => h.setAttribute(name, value), name, value);
    }
    public addMouseEventListener<K extends keyof MouseEventMap<ElementEventMap>>(
        type: K,
        preventDefault?: (ev: MouseEventShape) => boolean,
        preventNativeDefault?: (ev: MouseEventShape) => boolean,
        stopPropagation?: (ev: MouseEventShape) => boolean,
        capture?: boolean): Promise<EventListenerProxy<MouseEventMap<ElementEventMap>[K]>>{
        return this.addEventListener({
            type,
            shape: mouseEventShape,
            preventDefault,
            preventNativeDefault,
            stopPropagation,
            capture
        });
    }
    
}