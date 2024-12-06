export interface EventTargetLike<TEventMap>{
    addEventListener<TType extends keyof TEventMap>(type: TType, listener: (e: TEventMap[TType]) => void, capture?: boolean): void
    removeEventListener<TType extends keyof TEventMap>(type: TType, listener: (e: TEventMap[TType]) => void, capture?: boolean): void
}