export interface EventTarget<TEventType, TEventName>{
    addEventListener(name: TEventName, listener: (e: TEventType) => void, capture: boolean | undefined): void
    removeEventListener(name: TEventName, listener: (e: TEventType) => void, capture: boolean | undefined): void
}