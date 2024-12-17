export interface EventSource<TEvent> {
    addListener(listener: (e: TEvent) => void): void
    removeListener(listener: (e: TEvent) => void): void
}