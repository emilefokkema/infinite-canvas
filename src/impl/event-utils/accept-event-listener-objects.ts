import { EventSource } from "./event-source";
import { MappedCollection } from "./mapped-collection";

export interface EventSourceThatAcceptsEventListenerObjects<TEvent> extends EventSource<TEvent>{
    addListener(listener: ((ev: TEvent) => void) | EventListenerObject, onRemoved?: () => void): void;
    removeListener(listener: ((ev: TEvent) => void) | EventListenerObject): void;
}

export function isEventListenerObject<TEvent>(listener: ((ev: TEvent) => void) | EventListenerObject): listener is EventListenerObject{
    return !!listener && typeof (<any>listener).handleEvent === 'function';
}

interface EventListenerObjectRecord<TEvent>{
    listenerObject: EventListenerObject;
    listener: (ev: TEvent) => void;
    removedCallback: () => void;
}

interface ListenerObjectAndRemovedCallback {
    listenerObject: EventListenerObject;
    removedCallback?: () => void;
}

class EventListenerObjectCollection<TEvent extends Event> extends MappedCollection<ListenerObjectAndRemovedCallback, EventListenerObjectRecord<TEvent>>{
    constructor(private readonly source: EventSource<TEvent>){
        super();
    }
    protected mapsTo(mapped: EventListenerObjectRecord<TEvent>, original: ListenerObjectAndRemovedCallback): boolean{
        return mapped.listenerObject === original.listenerObject;
    }
    protected map(original: ListenerObjectAndRemovedCallback): EventListenerObjectRecord<TEvent>{
        const {listenerObject, removedCallback} = original;
        const listener = (ev: TEvent) => {
            listenerObject.handleEvent(ev);
        };
        const newRemovedCallback = () => {
            this.remove(original);
            removedCallback && removedCallback();
        };
        this.source.addListener(listener, newRemovedCallback);
        return {listener, listenerObject, removedCallback: newRemovedCallback};
    }
    protected onRemoved(record: EventListenerObjectRecord<TEvent>): void{
        this.source.removeListener(record.listener);
        record.removedCallback();
    }
}

class AcceptingEventListenerObjects<TEvent extends Event> implements EventSourceThatAcceptsEventListenerObjects<TEvent>{
    private readonly listenerObjectCollection: EventListenerObjectCollection<TEvent>;
    constructor(private readonly source: EventSource<TEvent>){
        this.listenerObjectCollection = new EventListenerObjectCollection(source);
    }
    public addListener(listener: ((ev: TEvent) => void) | EventListenerObject, removedCallback?: () => void): void{
        if(isEventListenerObject(listener)){
            this.listenerObjectCollection.add({listenerObject: listener, removedCallback});
        }else{
            this.source.addListener(listener, removedCallback);
        }
    }
    public removeListener(listener: ((ev: TEvent) => void) | EventListenerObject): void{
        if(isEventListenerObject(listener)){
            this.listenerObjectCollection.remove({listenerObject: listener});
        }else{
            this.source.removeListener(listener);
        }
    }
}

export function acceptEventListenerObjects<TEvent extends Event>(source: EventSource<TEvent>): EventSourceThatAcceptsEventListenerObjects<TEvent>{
    return new AcceptingEventListenerObjects(source);
}
