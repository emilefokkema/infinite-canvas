import { Transformation } from "../transformation";
import { Transformable } from "../transformable";

export class Zoom{
    private static maxScaleLogStep: number = 0.1;
    private currentScaleLog: number;
    private targetScaleLog: number;
    private initialTransformation: Transformation;
    private stepTimeout: any;
    constructor(
        private readonly transformable: Transformable,
        private readonly centerX: number,
        private readonly centerY: number,
         targetScale: number,
        private readonly onFinish: () => void){
            this.initialTransformation = transformable.transformation;
            this.currentScaleLog = 0;
            this.targetScaleLog = Math.log(targetScale);
            this.makeStep();
    }
    private makeStep(): void{
        const distance: number = this.targetScaleLog - this.currentScaleLog;
        if(Math.abs(distance) <= Zoom.maxScaleLogStep){
            this.currentScaleLog += distance;
            this.setTransformToCurrentScaleLog();
            this.onFinish();
        }else{
            this.currentScaleLog += distance < 0 ? -Zoom.maxScaleLogStep : Zoom.maxScaleLogStep;
            this.setTransformToCurrentScaleLog();
            this.stepTimeout = setTimeout(() => this.makeStep(), 20);
        }
    }
    private setTransformToCurrentScaleLog(): void{
        this.transformable.transformation = this.initialTransformation.before(
            Transformation.zoom(
                this.centerX,
                this.centerY,
                Math.exp(this.currentScaleLog)));
    }
    public cancel(): void{
        if(this.stepTimeout !== undefined){
            clearTimeout(this.stepTimeout);
        }
    }
}