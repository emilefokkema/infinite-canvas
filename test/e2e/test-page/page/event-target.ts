export interface EventTarget<TEventMap>{
    addEventListener<Type extends keyof TEventMap>(type: Type, listener: (ev: TEventMap[Type]) => void): void;
    removeEventListener<Type extends keyof TEventMap>(type: Type, listener: (ev: TEventMap[Type]) => void): void;
}