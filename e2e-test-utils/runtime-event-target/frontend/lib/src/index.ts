import type { EventTargetFactoryInitializer } from '../../api/event-target-factory-initializer'
import type { Options } from '../../../shared/options'
import { Connection } from './connection'
import { RuntimeEventTargetImpl } from './runtime-event-target-impl'

const initializeEventTargetFactory: EventTargetFactoryInitializer = (options: Options) => {
    return { 
        createEventTarget(eventTargetLike, connectionData) {
            const connection = new Connection(options, connectionData)
            return new RuntimeEventTargetImpl(connection, eventTargetLike);
        }
    };

}

export default initializeEventTargetFactory;