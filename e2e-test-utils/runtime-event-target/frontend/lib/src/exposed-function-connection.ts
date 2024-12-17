import type { ConnectionData } from '../../../shared/connection-data';
import type { EventMessage } from '../../../shared/messages';
import type { Connection } from './connection'
import type { MessageTarget } from './message-target';

export class ExposedFunctionConnection implements Connection {
    private readonly messageTarget: MessageTarget
    public constructor(connectionData: ConnectionData){
        this.messageTarget = {
            send(message: EventMessage): void{
                window.runtimeEventTargetSendEvent({
                    connectionId: connectionData.id,
                    message
                })
            }
        }
    }

    public getMessageTarget(): MessageTarget {
        return this.messageTarget;
    }
}