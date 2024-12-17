import { EventSource } from './event-source'

type Listener<TEvent> = (e: TEvent) => void

class EventMapper<
    TSourceEvent,
    TTargetEvent
> implements EventSource<TTargetEvent> {
    private readonly listeners: {
        targetListener: Listener<TTargetEvent>,
        sourceListener: Listener<TSourceEvent>
    }[] = [];
    public constructor(
        private readonly source: EventSource<TSourceEvent>,
        private readonly map: (targetListener: Listener<TTargetEvent>) => Listener<TSourceEvent>
    ){

    }

    public addListener(listener: Listener<TTargetEvent>): void {
        const sourceListener = this.map(listener);
        this.listeners.push({targetListener: listener, sourceListener});
        this.source.addListener(sourceListener);
    }

    public removeListener(listener: Listener<TTargetEvent>): void {
        const index = this.listeners.findIndex(l => l.targetListener === listener);
        if(index === -1){
            return;
        }
        const [{sourceListener}] = this.listeners.splice(index, 1);
        this.source.removeListener(sourceListener);
    }
}

export function map<
    TSourceEvent,
    TTargetEvent
>(
    source: EventSource<TSourceEvent>,
    map: (targetListener: Listener<TTargetEvent>) => Listener<TSourceEvent>
): EventSource<TTargetEvent> {
    return new EventMapper(source, map)
}