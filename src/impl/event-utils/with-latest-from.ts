import { EventSource } from './event-source';
import { MappedCollection } from './mapped-collection';

interface ListenerRecord<TEvent>{
    listener: (event: TEvent) => void,
    onRemoved?: () => void
}

class Subscription<TEvent>{
    constructor(
        private readonly source: EventSource<TEvent>,
        private readonly listener: (ev: TEvent) => void
    ){
        source.addListener(listener);
    }
    public remove(): void{
        this.source.removeListener(this.listener);
    }
}

class SubscriptionThatGetsLatestFromOther<TEvent, TOtherEvent>{
    private readonly subscription: Subscription<TEvent>;
    private readonly otherSubscription: Subscription<TOtherEvent>;
    constructor(
        source: EventSource<TEvent>,
        otherSource: EventSource<TOtherEvent>,
        public readonly listener: (events: [TEvent, TOtherEvent]) => void,
        private readonly onRemoved: () => void
    ){
        let latestFromOther: TOtherEvent;
        this.otherSubscription = new Subscription(otherSource, (e) => {
            latestFromOther = e;
        });
        this.subscription = new Subscription(source, (e) => {
            listener([e, latestFromOther]);
        });
    }
    public remove(): void{
        this.subscription.remove();
        this.otherSubscription.remove();
        if(this.onRemoved){
            this.onRemoved();
        }
    }
}

class EventSourceThatGetsLatestFromOther<TEvent, TOtherEvent> extends MappedCollection<ListenerRecord<[TEvent, TOtherEvent]>, SubscriptionThatGetsLatestFromOther<TEvent, TOtherEvent>> implements EventSource<[TEvent, TOtherEvent]>{
    constructor(
        private readonly source: EventSource<TEvent>,
        private readonly otherSource: EventSource<TOtherEvent>
    ){
        super();
    }
    protected map(record: ListenerRecord<[TEvent, TOtherEvent]>): SubscriptionThatGetsLatestFromOther<TEvent, TOtherEvent>{
        return new SubscriptionThatGetsLatestFromOther(this.source, this.otherSource, record.listener, record.onRemoved);
    }
    protected mapsTo(subscription: SubscriptionThatGetsLatestFromOther<TEvent, TOtherEvent>, record: ListenerRecord<[TEvent, TOtherEvent]>): boolean{
        return subscription.listener === record.listener;
    }
    protected onRemoved(subscription: SubscriptionThatGetsLatestFromOther<TEvent, TOtherEvent>): void{
        subscription.remove();
    }
    public addListener(listener: (events: [TEvent, TOtherEvent]) => void, onRemoved?: () => void): void{
        this.add({listener, onRemoved});
    }
    public removeListener(listener: (events: [TEvent, TOtherEvent]) => void): void{
        this.remove({listener})
    }
}

export function withLatestFrom<TEvent, TOtherEvent>(source: EventSource<TEvent>, otherSource: EventSource<TOtherEvent>): EventSource<[TEvent, TOtherEvent]>{
    return new EventSourceThatGetsLatestFromOther(source, otherSource);
}