import {PointAtInfinity} from "./point-at-infinity";
import {Point} from "./point";

export const down: PointAtInfinity = {direction: new Point(0, 1)};
export const up: PointAtInfinity = {direction: new Point(0, -1)};
export const left: PointAtInfinity = {direction: new Point(-1, 0)};
export const right: PointAtInfinity = {direction: new Point(1, 0)};