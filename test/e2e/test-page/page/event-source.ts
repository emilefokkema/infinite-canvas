export interface EventSource<TEvent>{
    addListener(listener: (ev: TEvent) => void): void;
    removeListener(listener: (ev: TEvent) => void): void;
}