export interface EventSource<TEvent> {
    addListener(listener: (event: TEvent) => void, onRemoved?: () => void): void;
    removeListener(listener: (event: TEvent) => void): void;
}
