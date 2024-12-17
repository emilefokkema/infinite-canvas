import { JSHandle } from 'puppeteer'
import { EventTargetLike } from '../shared/event-target-like'
import { RuntimeEventTarget } from './runtime-event-target'
import { EventTargetFactory } from '../frontend/api/event-target-factory'
import { ConnectionDataRepository } from './connection-data-repository'
import { RuntimeEventTargetImpl } from './runtime-event-target-impl'
import { EventSource } from './events/event-source'
import { ConnectionEventMessage } from '../shared/messages'
import { ExposedFunctionConnection } from './exposed-function-connection'

export async function createEventTarget<TMap>(
    factoryHandle: JSHandle<EventTargetFactory>,
    target: JSHandle<EventTargetLike<TMap>>,
    connectionDataRepository: ConnectionDataRepository,
    connectionEventMessages: EventSource<ConnectionEventMessage>    
): Promise<RuntimeEventTarget<TMap>>{
        const connectionData = connectionDataRepository.create();
        const eventTargetHandle = await factoryHandle.evaluateHandle(
            (factory, target, connection) => factory.createEventTarget(target, connection),
            target,
            connectionData
        );
        const connection = new ExposedFunctionConnection(
            connectionEventMessages,
            connectionData
        )
        return new RuntimeEventTargetImpl<TMap, {}>(
            connection,
            eventTargetHandle,
            {}
        )
}