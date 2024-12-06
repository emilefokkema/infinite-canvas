import WebSocket from 'ws'
import { createSocketMessageListener } from "../shared/create-socket-message-listener";
import { EventMessage } from "../shared/messages";

function isEventMessage(message: unknown): message is EventMessage{
    return !!message && (message as EventMessage).type === 'event';
}

export class TargetEventListener<TSerializedEvent, TType extends keyof any>{
    private socketMessageListener: (e: {data: unknown}) => void
    private listeners: ((e: TSerializedEvent) => void)[] = [];
    public constructor(
        private readonly socket: WebSocket,
        private readonly type: TType
    ){
        this.socketMessageListener = createSocketMessageListener(isEventMessage, (e) => {
            if(e.eventType !== this.type){
                return;
            }
            this.notifyListeners(e.serializedEvent as TSerializedEvent);
        })
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
                this.socket.removeEventListener('message', this.socketMessageListener)
            }
        }
    }
    public addListener(listener: (e: TSerializedEvent) => void): void{
        const isFirst = this.listeners.length === 0;
        this.listeners.push(listener)
        if(isFirst){
            this.socket.addEventListener('message', this.socketMessageListener)
        }
    }
}