import { MouseEventProperties } from "./mouse-event-properties";

export interface WheelEventProperties extends MouseEventProperties{
    readonly deltaX: number;
    readonly deltaY: number;
}