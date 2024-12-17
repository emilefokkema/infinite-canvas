export interface EventEmitter<TType extends string, TEvent> {
    addEventListener(type: TType, listener: (e: TEvent) => void): void
    removeEventListener(type: TType, listener: (e: TEvent) => void): void
}