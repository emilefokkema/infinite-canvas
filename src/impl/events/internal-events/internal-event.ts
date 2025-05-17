export interface InternalEvent  {
    readonly propagationStopped: boolean;
    readonly immediatePropagationStopped: boolean;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
