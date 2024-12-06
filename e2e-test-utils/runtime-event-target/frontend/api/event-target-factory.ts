import { EventTargetLike } from '../../shared/event-target-like'
import { ConnectionData } from '../../shared/connection-data';
import { RuntimeEventTarget } from './runtime-event-target'

export interface EventTargetFactory{
    createEventTarget<TMap>(
        eventTargetLike: EventTargetLike<TMap>,
        connection: ConnectionData
    ): RuntimeEventTarget<TMap>
}