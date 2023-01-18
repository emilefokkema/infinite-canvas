import { EventSource } from './event-source';
import { MappedCollection } from './mapped-collection';

type EventSources<TEvents extends unknown[]> = {[K in keyof TEvents]: EventSource<TEvents[K]>};

class SingleSubscription<TEvent>{
    constructor(private readonly source: EventSource<TEvent>, private readonly listener: (ev: TEvent) => void){
        source.addListener(listener);
    }
    public remove(): void{
        this.source.removeListener(this.listener);
    }
}

class ZippingSubscription<TEvents extends unknown[]>{
    private readonly singleSubscriptions: {[K in keyof TEvents]: SingleSubscription<TEvents[K]>};
    constructor(
        private readonly sources: EventSources<TEvents>,
        public readonly listener: (event: TEvents) => void,
        public readonly onRemoved: () => void){
            let latest: {[K in keyof TEvents]: TEvents[K][]} = this.getArray(() => []);
            this.singleSubscriptions = this.getArray(() => undefined);
            for(let i = 0; i < sources.length; i++){
                const source = sources[i];
                this.singleSubscriptions[i] = new SingleSubscription(source, (e) => {
                    latest[i].push(e);
                    const allHaveArrived: boolean = latest.every(l => l.length > 0);
                    if(allHaveArrived){
                        const latestValues = latest.map(l => l.shift());
                        listener(<TEvents>latestValues);
                    }
                });
            }
        }
    private getArray<TValue>(value: () => TValue): {[K in keyof TEvents]: TValue}{
        return <{[K in keyof TEvents]: TValue}>new Array(...new Array(this.sources.length)).map(value);
    }
    public remove(): void{
        for(let subscription of this.singleSubscriptions){
            subscription.remove();
        }
    }
}

interface ListenerRecord<TEvents extends unknown[]>{
    listener: (event: TEvents) => void,
    onRemoved?: () => void
}

class ZippingEventSource<TEvents extends unknown[]> extends MappedCollection<ListenerRecord<TEvents>, ZippingSubscription<TEvents>> implements EventSource<TEvents>{
    constructor(private readonly sources: EventSources<TEvents>){
        super();
    }
    protected mapsTo(subscription: ZippingSubscription<TEvents>, record: ListenerRecord<TEvents>): boolean{
        return subscription.listener === record.listener;
    }
    protected map(record: ListenerRecord<TEvents>): ZippingSubscription<TEvents>{
        return new ZippingSubscription(this.sources, record.listener, record.onRemoved);
    }
    protected onRemoved(subscription: ZippingSubscription<TEvents>): void{
        subscription.remove();
    }
    public addListener(listener: (event: TEvents) => void, onRemoved?: () => void): void{
        this.add({listener, onRemoved});
    }
    public removeListener(listener: (event: TEvents) => void): void{
        this.remove({listener})
    }
}

export function zip<TEvents extends unknown[]>(...sources: EventSources<TEvents>): EventSource<TEvents>{
    return new ZippingEventSource(sources);
}
