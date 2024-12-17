import { JSHandle, Page } from 'puppeteer'
import { Options } from '../shared/options'
import { EventTargetFactoryInitializer } from '../frontend/api/event-target-factory-initializer'
import { EventTargetFactory } from './event-target-factory';
import { createEventTarget } from './create-event-target'
import { EventTargetLike } from '../shared/event-target-like';
import { FRONTEND_PATH } from '../shared/constants'
import { RuntimeEventTarget } from './runtime-event-target';
import { createConnectionDataRepository } from './create-connection-data-repository';
import { getConnectionEventMessages } from './get-connection-event-messages';

export async function initializeEventTargetFactory(page: Page, options: Options): Promise<EventTargetFactory>{
    const frontendUrl = new URL(`${options.publicPath}/${FRONTEND_PATH}/index.js`, options.baseUrl)
    const moduleHandle = await page.evaluateHandle(`import('${frontendUrl}')`) as JSHandle<{default: EventTargetFactoryInitializer}>;
    const factory = await moduleHandle.evaluateHandle(({default: initializeFactory}) => initializeFactory());
    const connectionDataRepository = createConnectionDataRepository()
    const connectionEventMessages = await getConnectionEventMessages(page);
    return {
        createEventTarget<TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<RuntimeEventTarget<TMap>>{
            return createEventTarget(
                factory,
                target,
                connectionDataRepository,
                connectionEventMessages
            );
        }
    }
}