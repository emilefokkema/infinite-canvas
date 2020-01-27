import { StateInstanceDimension } from "./state-instance-dimension";
import { direction } from "./direction";
import { font } from "./font";
import { lineDashOffset, lineWidth } from "./infinite-canvas-transformable-scalar-state-instance-dimension";
import { lineDash } from "./line-dash";
import { strokeStyle, fillStyle } from "./fill-stroke-style";
import { textAlign } from "./text-align";
import { textBaseline } from "./text-baseline";
import { transformation } from "./transformation";
import { shadowColor } from "./shadow-color";
import { shadowOffset } from "./shadow-offset";
import { shadowBlur } from "./shadow-blur";

export const allDimensions: StateInstanceDimension[] = [
    direction, 
    fillStyle, 
    lineDashOffset,
    lineDash,
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