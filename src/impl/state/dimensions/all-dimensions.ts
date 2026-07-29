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
import { imageSmoothingEnabled } from "./image-smoothing-enabled";
import { imageSmoothingQuality } from "./image-smoothing-quality";
import { MinimalInstruction } from "../../instructions/instruction";
import { fontKerning } from "./font-kerning";
import { fontStretch } from "./font-stretch";
import { fontVariantCaps } from "./font-variant-caps";
import { letterSpacing } from "./letter-spacing";
import { textRendering } from "./text-rendering";
import { wordSpacing } from "./word-spacing";


export const allDimensions: StateInstanceDimension[] = [
    direction,
    imageSmoothingEnabled,
    imageSmoothingQuality, 
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
    fontStretch,
    fontVariantCaps,
    letterSpacing,
    textRendering,
    wordSpacing,
    fontKerning,
    shadowOffset,
    shadowBlur,
    shadowColor
];

export const textDrawingStylesDimensions: StateInstanceDimension<MinimalInstruction>[] = [
    font,
    fontStretch,
    fontVariantCaps,
    letterSpacing,
    textRendering,
    wordSpacing,
    textAlign,
    textBaseline,
    direction
];