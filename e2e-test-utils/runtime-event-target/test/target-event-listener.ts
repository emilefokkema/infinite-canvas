import { EventMessage } from "../shared/messages";
import { EventSource } from './events/event-source';

export class TargetEventListener<TSerializedEvent, TType extends keyof any>{
    private eventMessageListener: (e: EventMessage) => void
    private listeners: ((e: TSerializedEvent) => void)[] = [];
    public constructor(
        private readonly eventMessages: EventSource<EventMessage>,
        private readonly type: TType
    ){
        this.eventMessageListener = (e) => {
            if(e.eventType !== this.type){
                return;
            }
            this.notifyListeners(e.serializedEvent as TSerializedEvent);
        }
    }
    private notifyListeners(event: TSerializedEvent): void{
        for(const listener of this.listeners.slice()){
            listener(event);
        }
    }
    public removeListener(listener: (e: TSerializedEvent) => void): void{
        const index = this.listeners.indexOf(listener);
        if(index > -1){
            this.listeners.splice(index, 1);
            if(this.listeners.length === 0){
                this.eventMessages.removeListener(this.eventMessageListener)
            }
        }
    }
    public addListener(listener: (e: TSerializedEvent) => void): void{
        const isFirst = this.listeners.length === 0;
        this.listeners.push(listener)
        if(isFirst){
            this.eventMessages.addListener(this.eventMessageListener)
        }
    }
}