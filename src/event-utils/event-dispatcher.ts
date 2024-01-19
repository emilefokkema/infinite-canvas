import {EventSource} from "./event-source";
import {MappedCollection} from "./mapped-collection";

interface ListenerRecord<TEvent>{
    listener: (ev: TEvent) => void;
    removedCallback?: () => void;
}

export class EventDispatcher<TEvent> extends MappedCollection<ListenerRecord<TEvent>, ListenerRecord<TEvent>> implements EventSource<TEvent>{
    protected map(record: ListenerRecord<TEvent>): ListenerRecord<TEvent> {
        return record;
    }
    protected mapsTo(record: ListenerRecord<TEvent>, newRecord: ListenerRecord<TEvent>): boolean {
        return record.listener === newRecord.listener;
    }

    protected onRemoved(record: ListenerRecord<TEvent>): void {
        record.removedCallback && record.removedCallback();
    }

    public addListener(listener: (event: TEvent) => void, removedCallback?: () => void): void{
        this.add({listener, removedCallback});
    }
    public removeListener(listener: (event: TEvent) => void): void{
        this.remove({listener});
    }
    public dispatch(ev: TEvent): void{
        const listeners: ((ev: TEvent) => void)[] = this.mapped.map(r => r.listener);
        for(let listener of listeners){
            listener(ev);
        }
    }
}
