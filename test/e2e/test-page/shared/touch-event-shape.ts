import { TouchShape, touchShape } from "./touch-shape";

export interface TouchEventShape{
    touches: TouchShape[];
    targetTouches: TouchShape[];
    changedTouches: TouchShape[];
}

export const touchEventShape: TouchEventShape = {
    touches: [touchShape],
    targetTouches: [touchShape],
    changedTouches: [touchShape]
}
