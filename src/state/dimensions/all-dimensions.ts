import { StateInstanceDimension } from "./state-instance-dimension";
import { direction } from "./direction";
import { font } from "./font";
import { lineDashOffset } from "./line-dash-offset";
import { lineDash } from "./line-dash";
import { lineWidth } from "./line-width";
import { strokeStyle, fillStyle } from "./fill-stroke-style";
import { textAlign } from "./text-align";
import { textBaseline } from "./text-baseline";
import { transformation } from "./transformation";

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
    font
];