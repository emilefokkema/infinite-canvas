import { beforeEach, describe, it} from 'vitest'
import { Line } from "src/areas/line/line";
import { l, p } from "./builders";
import { expectAreasToBeEqual } from "./expectations";
import { Point } from "src/geometry/point";
import { Area } from "src/areas/area";

describe("a line", () => {
    let line: Line;

    beforeEach(() => {
        line = l(l => l.base(0, 0).direction(1, 0));
    });

    it.each([
        [new Point(1, 0), l(l => l.base(0, 0).direction(1, 0))],
        [new Point(1, 1), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [new Point(-1, 1), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)))],
        [new Point(-1, 0), l(l => l.base(0, 0).direction(1, 0))],
        [new Point(-1, -1), p(p => p.with(hp => hp.base(0, 0).normal(0, -1)))]
    ])("should result in the correct expansions with a point at infinity", (direction: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(line.expandToIncludeInfinityInDirection(direction), expectedExpansion)
    });

    it.each([
        [new Point(1, 0), l(l => l.base(0, 0).direction(1, 0))],
        [new Point(1, 1), p(p => p.with(hp => hp.base(0, 0).normal(0, 1)).with(hp => hp.base(1, 1).normal(0, -1)))]
    ])('should result in the correct expansions with a point', (point: Point, expectedExpansion: Area) => {
        expectAreasToBeEqual(line.expandToIncludePoint(point), expectedExpansion);
    })
});
