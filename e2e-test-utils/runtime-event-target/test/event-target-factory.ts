import { JSHandle } from 'puppeteer'
import { EventTargetLike } from '../shared/event-target-like'
import { RuntimeEventTarget } from './runtime-event-target'

export interface EventTargetFactory{
    createEventTarget<TMap>(target: JSHandle<EventTargetLike<TMap>>): Promise<RuntimeEventTarget<TMap>>
}