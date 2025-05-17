import { CurrentPath } from "../../interfaces/current-path";
import { InfiniteCanvasState } from "../../state/infinite-canvas-state";
import { SingleCornerRadii } from "../corner-radii";

export interface Corner{
    draw(currentPath: CurrentPath, state: InfiniteCanvasState): void
}

export interface TopLeftCorner {
    moveToEndingPoint(currentPath: CurrentPath, state: InfiniteCanvasState): void
    finishRect(currentPath: CurrentPath, state: InfiniteCanvasState): void
}

export interface RoundableCorner<TCorner>{
    round(radii: SingleCornerRadii): TCorner
}

export interface VisibleCorner extends Corner, RoundableCorner<Corner>{

}

export interface VisibleTopLeftCorner extends TopLeftCorner, RoundableCorner<TopLeftCorner>{

}