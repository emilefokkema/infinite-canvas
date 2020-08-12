import { Transformable } from "../transformable";
export declare class Zoom {
    private readonly transformable;
    private readonly centerX;
    private readonly centerY;
    private readonly onFinish;
    private maxScaleLogStep;
    private currentScaleLog;
    private targetScaleLog;
    private initialTransformation;
    private stepTimeout;
    constructor(transformable: Transformable, centerX: number, centerY: number, targetScale: number, onFinish: () => void);
    private makeStep;
    private setTransformToCurrentScaleLog;
    cancel(): void;
}
