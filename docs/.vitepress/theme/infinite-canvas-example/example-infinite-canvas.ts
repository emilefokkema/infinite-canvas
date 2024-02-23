import { fromEvent, filter, firstValueFrom } from 'rxjs'
import InfiniteCanvas, { Units } from 'infinite-canvas'
import { 
    EXAMPLE_INFINITE_CANVAS_INITIALIZED,
    EXAMPLE_INFINITE_CANVAS_REGISTERED,
    TOUCH_IGNORED,
    WHEEL_IGNORED
} from './constants';

class ParentConnection{
    constructor(private readonly port: MessagePort){}

    public notifyWheelIgnored(): void{
        this.port.postMessage({type: WHEEL_IGNORED})
    }
    public notifyTouchIgnored(): void{
        this.port.postMessage({type: TOUCH_IGNORED})
    }
}

function connectToParent(): Promise<ParentConnection | undefined>{
    return new Promise((res) => {
        const parent = window.parent;
        if(!parent){
            res(undefined)
        }
        const channel = new MessageChannel();
        const port = channel.port2;
        const portMessages = fromEvent<MessageEvent>(port, 'message')
        firstValueFrom(portMessages.pipe(
            filter(({data}) => data.type === EXAMPLE_INFINITE_CANVAS_REGISTERED),
        )).then(() => res(new ParentConnection(port)))
        port.start()
        parent.postMessage({type: EXAMPLE_INFINITE_CANVAS_INITIALIZED}, location.origin, [channel.port1]);
    })
}

export default class ExampleInfiniteCanvas extends InfiniteCanvas{
    constructor(canvasEl: HTMLCanvasElement){
        super(canvasEl, {units: Units.CSS})
        const { width, height } = canvasEl.getBoundingClientRect();
        canvasEl.width = width * devicePixelRatio;
        canvasEl.height = height * devicePixelRatio;
        connectToParent().then((connection) => {
            if(!connection){
                return;
            }
            const wheelIgnoredSubscription = fromEvent(this, 'wheelignored').subscribe((e) => {
                e.preventDefault();
                connection.notifyWheelIgnored();
            })
            const touchIgnoredSubscription = fromEvent(this, 'touchignored').subscribe((e) => {
                e.preventDefault();
                connection.notifyTouchIgnored();
            })
        });
    }
}
export { Units }