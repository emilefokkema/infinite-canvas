import {EventSource} from "./event-source";
import {EventDispatcher} from "./event-dispatcher";
import {transform} from "./transform";

class SharedSplitEventSourceBuilder<TEvent>{
    private readonly firstDispatcher: EventDispatcher<TEvent> = new EventDispatcher<TEvent>();
    private readonly secondDispatcher: EventDispatcher<TEvent> = new EventDispatcher<TEvent>();
    private readonly sourceListener: (ev: TEvent) => void;
    private numberOfListeners: number = 0;
    constructor(private readonly source: EventSource<TEvent>) {
        this.sourceListener = (ev: TEvent) => this.dispatchEvent(ev);
    }
    private add(): void{
        if(this.numberOfListeners === 0){
            this.source.addListener(this.sourceListener);
        }
        this.numberOfListeners++;
    }
    private remove(): void{
        this.numberOfListeners--;
        if(this.numberOfListeners === 0){
            this.source.removeListener(this.sourceListener);
        }
    }
    private dispatchEvent(ev: TEvent): void{
        this.firstDispatcher.dispatch(ev);
        this.secondDispatcher.dispatch(ev);
    }
    public build(): {first: EventSource<TEvent>, second: EventSource<TEvent>}{
        return {
            first: transform(this.firstDispatcher, (listener, onRemoved) => {
                this.add();
                onRemoved(() => this.remove());
                return listener;
            }),
            second: transform(this.secondDispatcher, (listener, onRemoved) => {
                this.add();
                onRemoved(() => this.remove());
                return listener;
            })
        };
    }
}

export function shareSplit<TEvent>(source: EventSource<TEvent>): {first: EventSource<TEvent>, second: EventSource<TEvent>}{
    return new SharedSplitEventSourceBuilder(source).build();
}
