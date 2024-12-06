import { JSHandle } from 'puppeteer'
import { EventTargetLike } from '../shared/event-target-like'
import { Options } from '../shared/options'
import { RuntimeEventTarget } from './runtime-event-target'
import { EventTargetFactory } from '../frontend/api/event-target-factory'
import { ConnectionDataRepository } from './connection-data-repository'
import { Connection } from './connection'
import { RuntimeEventTargetImpl } from './runtime-event-target-impl'

export async function createEventTarget<TMap>(
    factoryHandle: JSHandle<EventTargetFactory>,
    target: JSHandle<EventTargetLike<TMap>>,
    options: Options,
    connectionDataRepository: ConnectionDataRepository): Promise<RuntimeEventTarget<TMap>>{
        const connectionData = await connectionDataRepository.create();
        const eventTargetHandle = await factoryHandle.evaluateHandle(
            (factory, target, connection) => factory.createEventTarget(target, connection),
            target,
            connectionData
        );
        const connection = new Connection(
            options,
            connectionDataRepository,
            connectionData
        )
        return new RuntimeEventTargetImpl<TMap, {}>(
            connection,
            eventTargetHandle,
            {}
        )
}