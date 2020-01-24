import { Transformation } from "../transformation";
import { ClippedPaths } from "../instructions/clipped-paths";

export interface StateInstanceProperties {
    fillStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    lineDash: number[];
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineDashOffset: number;
    transformation: Transformation;
    direction: CanvasDirection;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    clippedPaths: ClippedPaths;
    fillAndStrokeStylesTransformed: boolean;
}