import { StateInstanceDimension } from "./state-instance-dimension";
import { direction } from "./direction";
import { font } from "./font";
import { lineDashOffset, lineWidth } from "./infinite-canvas-transformable-scalar-state-instance-dimension";
import { shadowBlur } from './shadow-blur'
import { lineDash } from "./line-dash";
import { strokeStyle, fillStyle } from "./fill-stroke-style";
import { textAlign } from "./text-align";
import { textBaseline } from "./text-baseline";
import { transformation } from "./transformation";
import { shadowColor } from "./shadow-color";
import { shadowOffset } from "./shadow-offset";
import { lineCap } from "./line-cap";
import { lineJoin } from "./line-join";
import { miterLimit } from "./miter-limit";
import { globalAlpha } from "./global-alpha";
import { globalCompositeOperation } from "./global-composite-operation";
import { filter } from "./filter";

export const allDimensions: StateInstanceDimension[] = [
    direction, 
    fillStyle, 
    lineDashOffset,
    lineDash,
    lineCap,
    lineJoin,
    miterLimit,
    globalAlpha,
    globalCompositeOperation,
    filter,
    lineWidth,
    strokeStyle,
    textAlign,
    textBaseline,
    transformation,
    font,
    shadowOffset,
    shadowBlur,
    shadowColor
];