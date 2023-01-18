import {EventSource} from "./event-source";
import {MappedCollection} from "./mapped-collection";

interface ListenerRecord<TEvent>{
    listener: (ev: TEvent) => void;
    removedCallback: () => void;
}

export class EventDispatcher<TEvent> extends MappedCollection<(ev: TEvent) => void, ListenerRecord<TEvent>> implements EventSource<TEvent>{
    protected map(listener: (ev: TEvent) => void, removedCallback?: () => void): ListenerRecord<TEvent> {
        return {listener, removedCallback};
    }
    protected mapsTo(record: ListenerRecord<TEvent>, listener: (ev: TEvent) => void): boolean {
        return record.listener === listener;
    }

    protected onRemoved(record: ListenerRecord<TEvent>): void {
        record.removedCallback && record.removedCallback();
    }

    public addListener(listener: (event: TEvent) => void): void{
        this.add(listener);
    }
    public removeListener(listener: (event: TEvent) => void): void{
        this.remove(listener);
    }
    public dispatch(ev: TEvent): void{
        const listeners: ((ev: TEvent) => void)[] = this.mapped.map(r => r.listener);
        for(let listener of listeners){
            listener(ev);
        }
    }
}
