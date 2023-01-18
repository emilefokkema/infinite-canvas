export interface MouseEventShape{
    button: number;
    offsetX: number;
    offsetY: number;
    clientX: number;
    clientY: number;
    movementX: number;
    movementY: number;
    ctrlKey: boolean;
    cancelable: boolean;
    nativeCancelable: boolean;
    isTrusted: boolean;
    bubbles: boolean;
    eventPhase: number;
    type: string;
}

export const mouseEventShape: MouseEventShape = {
    button: 0,
    offsetX: 0,
    offsetY: 0,
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
    ctrlKey: false,
    cancelable: false,
    nativeCancelable: false,
    isTrusted: false,
    bubbles: false,
    eventPhase: 0,
    type: ''
}
