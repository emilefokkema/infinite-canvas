import { EventDispatcher } from '../../../utils'

export interface ExamplePageInfiniteCanvasProxy{
    disableGreedyGestureHandling(): void
    addWheelIgnoredListener(listener: () => void): void
    removeWheelIgnoredListener(listener: () => void): void
    addTouchIgnoredListener(listener: () => void): void
    removeTouchIgnoredListener(listener: () => void): void
}

type InitializedListener = (source: MessageEventSource, proxy: ExamplePageInfiniteCanvasProxy) => void

export interface ExampleRegistry{
    addInitializedListener(listener: InitializedListener): void
    removeInitializedListener(listener: InitializedListener, source: MessageEventSource | undefined): void
}
const disableGreedyGestureHandlingMessageType = 'DISABLE_GREEDY_GESTURE_HANDLING';
const wheelIgnoredMessageType = 'WHEEL_IGNORED';
const touchIgnoredMessageType = 'TOUCH_IGNORED';
const infiniteCanvasInitializedMessageType = 'EXAMPLE_INFINITE_CANVAS_INITIALIZED';

class ExamplePageInfiniteCanvasProxyImpl implements ExamplePageInfiniteCanvasProxy{
    private wheelIgnoredDispatcher: EventDispatcher<[void]> = new EventDispatcher();
    private touchIgnoredDispatcher: EventDispatcher<[void]> = new EventDispatcher();
    constructor(
        public readonly infCanvasId: number,
        public readonly port: MessagePort,
        public readonly source: MessageEventSource){}
    public disableGreedyGestureHandling(): void{
        this.port.postMessage({type: disableGreedyGestureHandlingMessageType, id: this.infCanvasId})
    }
    public addWheelIgnoredListener(listener: () => void): void{
        this.wheelIgnoredDispatcher.addListener(listener);
    }
    public removeWheelIgnoredListener(listener: () => void): void{
        this.wheelIgnoredDispatcher.removeListener(listener);
    }
    public addTouchIgnoredListener(listener: () => void): void{
        this.touchIgnoredDispatcher.addListener(listener);
    }
    public removeTouchIgnoredListener(listener: () => void): void{
        this.touchIgnoredDispatcher.removeListener(listener);
    }
    public dispatchWheelIgnored(): void{
        this.wheelIgnoredDispatcher.dispatch();
    }
    public dispatchTouchIgnored(): void{
        this.touchIgnoredDispatcher.dispatch();
    }
}

export function createExampleRegistry(): ExampleRegistry{
    const initializedDispatcher: EventDispatcher<[MessageEventSource, ExamplePageInfiniteCanvasProxy]> = new EventDispatcher();
    const proxies: ExamplePageInfiniteCanvasProxyImpl[] = [];
    let listening: boolean = false;
    function addInitializedListener(listener: InitializedListener): void{
        if(!listening){
            startListening();
        }
        initializedDispatcher.addListener(listener)
    }
    function removeInitializedListener(listener: InitializedListener, source: MessageEventSource | undefined): void{
        initializedDispatcher.removeListener(listener)
        removeProxiesWithSource(source);
    }
    function removeProxiesWithSource(source: MessageEventSource | undefined): void{
        let index: number;
        while((index = proxies.findIndex(p => p.source === source)) !== -1){
            proxies.splice(index, 1)
        }
    }
    function findProxy(port: MessagePort, infCanvasId: number): ExamplePageInfiniteCanvasProxyImpl | undefined{
        return proxies.find(p => p.port === port && p.infCanvasId === infCanvasId);
    }
    function onMessageFromPort(e: MessageEvent, port: MessagePort, source: MessageEventSource): void{
        const data = e.data;
        if(data.type === wheelIgnoredMessageType){
            const proxy = findProxy(port, data.id)
            if(!proxy){
                return;
            }
            proxy.dispatchWheelIgnored();
        }else if(data.type === touchIgnoredMessageType){
            const proxy = findProxy(port, data.id)
            if(!proxy){
                return;
            }
            proxy.dispatchTouchIgnored();
        }else if(data.type === infiniteCanvasInitializedMessageType){
            const proxy = new ExamplePageInfiniteCanvasProxyImpl(data.id, port, source);
            proxies.push(proxy)
            initializedDispatcher.dispatch(source, proxy)
        }
    }
    function startListening(): void{
        addEventListener('message', e => {
            const data = e.data;
            if(data.type === infiniteCanvasInitializedMessageType && e.source !== null){
                const port = e.ports[0];
                const source = e.source;
                port.onmessage = (e) => onMessageFromPort(e, port, source);
                const proxy = new ExamplePageInfiniteCanvasProxyImpl(data.id, port, source);
                proxies.push(proxy)
                initializedDispatcher.dispatch(e.source, proxy)
            }
        })
        listening = true;
    }
    
    return { addInitializedListener, removeInitializedListener };
}