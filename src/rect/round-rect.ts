import { CurrentPath } from "../interfaces/current-path";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { getCornerRadii } from "./corner-radii";
import { Rect } from "./rect";

export function roundRect(
    currentPath: CurrentPath,
    rectStrategy: Rect,
    radii: number | DOMPointInit | Iterable<number | DOMPointInit> | undefined,
    state: InfiniteCanvasState
): void{
    if(radii === undefined){
        rectStrategy.addSubpaths(currentPath, state);
        return;
    }
    let cornerRadii = getCornerRadii(radii);
    if(!cornerRadii){
        return;
    }
    const roundRectStrategy = rectStrategy.getRoundRect(cornerRadii);
    roundRectStrategy.addSubpaths(currentPath, state)
}