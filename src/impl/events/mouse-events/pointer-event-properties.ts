import { MouseEventProperties } from "./mouse-event-properties";

export interface PointerEventProperties extends MouseEventProperties{
    readonly width: number;
    readonly height: number;
}