import type { EventTargetFactoryInitializer } from '../../api/event-target-factory-initializer'
import { RuntimeEventTargetImpl } from './runtime-event-target-impl'
import { ExposedFunctionConnection } from './exposed-function-connection'

const initializeEventTargetFactory: EventTargetFactoryInitializer = () => {
    return { 
        createEventTarget(eventTargetLike, connectionData) {
            const connection = new ExposedFunctionConnection(connectionData);
            return new RuntimeEventTargetImpl(connection, eventTargetLike);
        }
    };

}

export default initializeEventTargetFactory;