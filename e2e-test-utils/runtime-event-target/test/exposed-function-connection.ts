import { ConnectionData } from '../shared/connection-data';
import { ConnectionEventMessage, EventMessage } from '../shared/messages';
import { Connection } from './connection'
import { EventSource } from './events/event-source'
import { map } from './events/map';


export class ExposedFunctionConnection implements Connection {
    private readonly eventMessages: EventSource<EventMessage>
    public constructor(
        connectionEventMessages: EventSource<ConnectionEventMessage>,
        connectionData: ConnectionData
    ){
        this.eventMessages = map(connectionEventMessages, (emit) => ({connectionId, message}: ConnectionEventMessage) => {
            if(connectionId !== connectionData.id){
                return;
            }
            emit(message);
        })
    }

    public getEventMessages(): EventSource<EventMessage> {
        return this.eventMessages;
    }
}