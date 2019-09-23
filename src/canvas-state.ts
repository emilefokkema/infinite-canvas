export interface CanvasState{
    readonly lineWidth: number;
    readonly lineDashOffset: number;
    readonly lineDash: number[];
    readonly fillStyle: string | CanvasGradient | CanvasPattern;
    readonly strokeStyle: string | CanvasGradient | CanvasPattern;
}