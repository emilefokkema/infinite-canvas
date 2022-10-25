import { EventSource } from "./event-source";

interface ListenerRecord<TOldEvent, TNewEvent>{
    oldListener: (ev: TOldEvent) => void,
    newListener: (ev: TNewEvent) => void
}

class TransformedEventSource<TOldEvent, TNewEvent> implements EventSource<TNewEvent>{
    private listeners: ListenerRecord<TOldEvent, TNewEvent>[] = [];
    constructor(
        private readonly source: EventSource<TOldEvent>,
        private readonly transformer: (newListener: (ev: TNewEvent) => void) => (ev: TOldEvent) => void){
    }
    public addListener(newListener: (ev: TNewEvent) => void): void{
        const oldListener = this.transformer(newListener);
        this.source.addListener(oldListener);
        this.listeners.push({oldListener, newListener});
    }
    public removeListener(listener: (ev: TNewEvent) => void): void{
        const index = this.listeners.findIndex(r => r.newListener === listener);
        if(index === -1){
            return;
        }
        const [record] = this.listeners.splice(index, 1);
        this.source.removeListener(record.oldListener);
    }
}

export function debounce<T>(source: EventSource<T>, interval: number): EventSource<T>{
    return new TransformedEventSource(source, (listener) => {
        let timeoutId: any = undefined;
        let latestValue: T = undefined;
        return (e) => {
            latestValue = e;
            if(timeoutId !== undefined){
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                timeoutId = undefined;
                listener(latestValue);
            }, interval);
        }
    });
}