import { TouchProperties } from "./touch-properties";

export interface TouchEventProperties{
    readonly targetTouches: TouchProperties[];
    readonly changedTouches: TouchProperties[];
    readonly touches: TouchProperties[];
}