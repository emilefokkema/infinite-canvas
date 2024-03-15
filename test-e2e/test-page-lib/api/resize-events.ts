import { EventTarget } from './event-target'

export interface ResizeEvent{
    positiveSize: boolean
}

export type ResizeEvents = EventTarget<ResizeEvent, 'resize'>