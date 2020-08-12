import { AnchorSet } from "./anchor-set";
import { Transformer } from "../transformer/transformer";
import { Point } from "../geometry/point";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
export declare function mapWheelEvents(canvasElement: HTMLCanvasElement, transformer: Transformer, anchorSet: AnchorSet, getRelativePosition: (clientX: number, clientY: number) => Point, config: InfiniteCanvasConfig): void;
