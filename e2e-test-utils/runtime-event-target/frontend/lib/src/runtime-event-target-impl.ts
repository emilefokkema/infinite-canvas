import type { EventTargetLike } from '../../../shared/event-target-like';
import type { EventMessage } from '../../../shared/messages';
import type { ChartMap, SerializablePropertyChart } from '../../../shared/serializable-types';
import type { RuntimeEventTarget } from '../../api/runtime-event-target'
import type { Connection } from './connection';
import { serializeEvent } from './serialize-event';

class TargetEventListener<TMap, TType extends keyof TMap>{
    private readonly additionalHandlers: ((e: TMap[TType]) => void)[] = []
    private readonly listener: (e: TMap[TType]) => void
    public constructor(
        socket: WebSocket,
        private readonly eventTargetLike: EventTargetLike<TMap>,
        private readonly type: TType,
        chart: SerializablePropertyChart<TMap[TType]>
    ){
        const listener = this.listener = (e: TMap[TType]): void => {
            for(const additionalHandler of this.additionalHandlers){
                additionalHandler(e);
            }
            const message: EventMessage = {
                type: 'event',
                eventType: type,
                serializedEvent: serializeEvent(e, chart)
            };
            socket.send(JSON.stringify(message))
        }
        eventTargetLike.addEventListener(type, listener);
    }

    public handleEvent(handler: (e: TMap[TType]) => void): void{
        this.additionalHandlers.push(handler);
    }

    public switchToCapture(): void {
        this.eventTargetLike.removeEventListener(this.type, this.listener);
        this.eventTargetLike.addEventListener(this.type, this.listener, true);
    }
}

type ListenerMap<TMap> = {[type in keyof TMap]?: TargetEventListener<TMap, type>}

export class RuntimeEventTargetImpl<TMap> implements RuntimeEventTarget<TMap>{
    private readonly listenerMap: ListenerMap<TMap> = {};
    public constructor(
        private readonly connection: Connection,
        private readonly eventTargetLike: EventTargetLike<TMap>
    ){}
    public async emitEvents(map: ChartMap<TMap>): Promise<void>{
        const socket = await this.connection.getSocket();
        for(const type in map){
            const chart = map[type]
            if(!chart){
                continue;
            }
            const listener = new TargetEventListener(socket, this.eventTargetLike, type, chart as SerializablePropertyChart<TMap[typeof type]>)
            this.listenerMap[type] = listener;
        }
    }
    public handleEvents<TType extends keyof TMap>(type: TType, handler: (e: TMap[TType]) => void): void{
        const listener = this.listenerMap[type];
        listener?.handleEvent(handler);
    }

    public switchToCapture(type: keyof TMap): void {
        const listener = this.listenerMap[type];
        listener?.switchToCapture();
    }
}