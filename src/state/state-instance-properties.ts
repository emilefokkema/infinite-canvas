import { Transformation } from "../transformation";
import { ClippedPaths } from "../instructions/clipped-paths";
import { Point } from "../geometry/point";
import { TransformableFilter } from "./dimensions/transformable-filter";

export interface StateInstanceProperties {
    fillStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    lineCap: CanvasLineCap;
    lineJoin: CanvasLineJoin;
    lineDash: number[];
    miterLimit: number;
    globalAlpha: number;
    globalCompositeOperation: GlobalCompositeOperation;
    filter: TransformableFilter;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineDashOffset: number;
    transformation: Transformation;
    direction: CanvasDirection;
    font: string;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    clippedPaths: ClippedPaths;
    fillAndStrokeStylesTransformed: boolean;
    shadowOffset: Point;
    shadowColor: string;
    shadowBlur: number;
}