import {EventSource} from "./event-source";
import {EventDispatcher} from "./event-dispatcher";
import {transform} from "./transform";

class SharedEventSourceBuilder<TEvent>{
    private readonly dispatcher: EventDispatcher<TEvent> = new EventDispatcher<TEvent>();
    private readonly sourceListener: (ev: TEvent) => void;
    private numberOfListeners: number = 0;
    constructor(private readonly source: EventSource<TEvent>) {
        this.sourceListener = (ev:TEvent) => this.dispatcher.dispatch(ev);
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
    public build(): EventSource<TEvent>{
        return transform(this.dispatcher, (listener, onRemoved) => {
            this.add();
            onRemoved(() => this.remove());
            return listener;
        });
    }
}

export function share<TEvent>(source: EventSource<TEvent>): EventSource<TEvent>{
    return new SharedEventSourceBuilder(source).build();
}
