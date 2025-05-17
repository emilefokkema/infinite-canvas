import {EventSource} from "./event-source";
import { MappedCollection } from "./mapped-collection";

interface ListenerRecord<TEvent>{
    listener: (ev: TEvent) => void;
    removedCallback?: () => void;
}

class RemovingEventSource<TEvent> extends MappedCollection<ListenerRecord<TEvent>, ListenerRecord<TEvent>> implements EventSource<TEvent>{
    constructor(private readonly source: EventSource<TEvent>) {
        super();
    }

    protected map(record: ListenerRecord<TEvent>): ListenerRecord<TEvent> {
        const removedCallback = () => {
            this.remove(record);
            record.removedCallback && record.removedCallback();
        };
        this.source.addListener(record.listener, removedCallback);
        return {listener: record.listener, removedCallback};
    }

    protected mapsTo(mapped: ListenerRecord<TEvent>, original: ListenerRecord<TEvent>): boolean {
        return mapped.listener === original.listener;
    }

    protected onRemoved(mapped: ListenerRecord<TEvent>): void {
        mapped.removedCallback();
        this.source.removeListener(mapped.listener);
    }

    public addListener(listener: (event: TEvent) => void, removedCallback?: () => void): void{
        this.add({listener, removedCallback});
    }
    public removeListener(listener: (event: TEvent) => void): void{
        this.remove({listener});
    }
}

interface MappedListenerRecord<TOldEvent, TNewEvent> {
    oldListener: (ev: TOldEvent) => void;
    newListener: (ev: TNewEvent) => void;
    removedCallback: () => void;
}
class TransformedEventSource<TOldEvent, TNewEvent> extends MappedCollection<ListenerRecord<TNewEvent>, MappedListenerRecord<TOldEvent, TNewEvent>> implements EventSource<TNewEvent>{
    private readonly old: EventSource<TOldEvent>
    constructor(
        old: EventSource<TOldEvent>,
        private readonly transform: (
            newListener: (ev: TNewEvent) => void,
            onRemoved: (callback: () => void) => void) => (ev: TOldEvent) => void) {
                super();
                this.old = new RemovingEventSource(old);
    }
    protected map(originalRecord: ListenerRecord<TNewEvent>): MappedListenerRecord<TOldEvent, TNewEvent>{
        const record: MappedListenerRecord<TOldEvent, TNewEvent> = {
            oldListener: undefined,
            newListener: originalRecord.listener,
            removedCallback: () => {
                originalRecord.removedCallback && originalRecord.removedCallback();
            }
        };
        record.oldListener = this.transform(originalRecord.listener, (callback) => record.removedCallback = () => {
            originalRecord.removedCallback && originalRecord.removedCallback();
            callback();
        });
        this.old.addListener(record.oldListener, () => this.removeListener(originalRecord.listener));
        return record;
    }
    protected mapsTo(record: MappedListenerRecord<TOldEvent, TNewEvent>, original: ListenerRecord<TNewEvent>): boolean{
        return record.newListener === original.listener;
    }
    protected onRemoved(record: MappedListenerRecord<TOldEvent, TNewEvent>): void{
        this.old.removeListener(record.oldListener);
        record.removedCallback();
    }
    addListener(listener: (event: TNewEvent) => void, removedCallback?: () => void): void{
        this.add({listener, removedCallback});
    }
    removeListener(listener: (event: TNewEvent) => void): void{
        this.remove({listener});
    }
}

export function transform<TOldEvent, TNewEvent>(
    old: EventSource<TOldEvent>,
    transform: (
        newListener: (ev: TNewEvent) => void,
        onRemoved: (callback: () => void) => void
    ) => (ev: TOldEvent) => void
): EventSource<TNewEvent>{
    return new TransformedEventSource(old, transform);
}
