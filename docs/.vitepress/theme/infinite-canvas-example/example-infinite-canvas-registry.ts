import { fromEvent, filter, map, mergeMap, type Observable } from 'rxjs'
import { EXAMPLE_INFINITE_CANVAS_INITIALIZED, EXAMPLE_INFINITE_CANVAS_REGISTERED, WHEEL_IGNORED, TOUCH_IGNORED } from './constants'

class ExampleInfiniteCanvasConnection{
    public readonly wheelIgnored: Observable<void>
    public readonly touchIgnored: Observable<void>
    constructor(portMessages: Observable<MessageEvent>){
        this.wheelIgnored = portMessages.pipe(
            filter(({data}) => data.type === WHEEL_IGNORED),
            map(() => {})
        )
        this.touchIgnored = portMessages.pipe(
            filter(({data}) => data.type === TOUCH_IGNORED),
            map(() => {})
        )
    }
    public static create(port: MessagePort): ExampleInfiniteCanvasConnection{
        const portMessages = fromEvent<MessageEvent>(port, 'message')
        port.start();
        port.postMessage({type: EXAMPLE_INFINITE_CANVAS_REGISTERED})
        return new ExampleInfiniteCanvasConnection(portMessages);
    }
}

export class ExampleInfiniteCanvasesSubscription{
    public readonly wheelIgnored: Observable<void>
    public readonly touchIgnored: Observable<void>
    constructor(connections: Observable<ExampleInfiniteCanvasConnection>){
        this.wheelIgnored = connections.pipe(mergeMap(c => c.wheelIgnored))
        this.touchIgnored = connections.pipe(mergeMap(c => c.touchIgnored))
    }

    public static create(windowMessages: Observable<MessageEvent>, iFrame: HTMLIFrameElement): ExampleInfiniteCanvasesSubscription{
        const iFrameWindow = iFrame.contentWindow
        const connectionsFromIFrame = windowMessages.pipe(
            filter(e => e.source === iFrameWindow && e.data && e.data.type === EXAMPLE_INFINITE_CANVAS_INITIALIZED),
            map(e => ExampleInfiniteCanvasConnection.create(e.ports[0])))

        return new ExampleInfiniteCanvasesSubscription(connectionsFromIFrame);
    }
}

export class ExampleInfiniteCanvasRegistry{
    constructor(private readonly windowMessages: Observable<MessageEvent>){

    }

    public subscribeToExampleInfiniteCanvases(iFrame: HTMLIFrameElement): ExampleInfiniteCanvasesSubscription{
        return ExampleInfiniteCanvasesSubscription.create(this.windowMessages, iFrame);
    }
    public static create(): ExampleInfiniteCanvasRegistry | undefined{
        if(typeof window === 'undefined' || !window){
            return undefined;
        }
        return new ExampleInfiniteCanvasRegistry(fromEvent<MessageEvent>(window, 'message'));
    }
}