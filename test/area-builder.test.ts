import { InfiniteCanvasAreaBuilder } from "../src/areas/infinite-canvas-area-builder";
import { Area } from "../src/areas/area";
import { empty } from "../src/areas/empty";
import { Point } from "../src/geometry/point";
import { expectAreasToBeEqual } from "./expectations";
import { ls, p, r, l } from "./builders";
import { plane } from "../src/areas/plane";

type AreaBuildStep = [(builder: InfiniteCanvasAreaBuilder) => void, Area];
type AreaBuildTestData = [((builder: InfiniteCanvasAreaBuilder) => void)[], Area];

function createStepData(steps: AreaBuildStep[]): AreaBuildTestData[]{
    const result: AreaBuildTestData[] = [];
    for(let i:number = 0; i < steps.length; i++){
        const stepsToInclude: AreaBuildStep[] = steps.slice(0, i + 1);
        const seed: AreaBuildTestData = [[], undefined];
        result.push(stepsToInclude.reduce((result, step) => [result[0].concat([step[0]]), step[1]], seed));
    }
    return result;
}

describe("an area builder", () => {
    let areaBuilder: InfiniteCanvasAreaBuilder;
    
    beforeEach(() => {
        areaBuilder = new InfiniteCanvasAreaBuilder();
    });

    describe("that starts with a point at infinity", () => {
        let areaToAdd: Area;

        beforeEach(() => {
            areaToAdd = p(p => p
                .with(hp => hp.base(0, 1).normal(0, -1))
                .with(hp => hp.base(0, 1).normal(1, 0))
                .with(hp => hp.base(1, 0).normal(0, 1))
                .with(hp => hp.base(1, 0).normal(-1, 0)))
            areaBuilder.addInfinityInDirection(new Point(1, 0));
        });

        describe("and then adds another point at infinity", () => {

            beforeEach(() => {
                areaBuilder.addInfinityInDirection(new Point(0, -1));
            });

            it("should, when a point is added, end up with a polygon with one vertex", () => {
                areaBuilder.addPoint(new Point(0, 1));
                expectAreasToBeEqual(areaBuilder.area, p(p => p
                    .with(hp => hp.base(0, 1).normal(0, -1))
                    .with(hp => hp.base(0, 1).normal(1, 0))));
            });

            describe("and then adds another point at infinity not between the two existing", () => {

                beforeEach(() => {
                    areaBuilder.addInfinityInDirection(new Point(-1, -1));
                });

                it("should, when a point is added, end up with a polygon with one vertex", () => {
                    areaBuilder.addPoint(new Point(0, 1));
                    expectAreasToBeEqual(areaBuilder.area, p(p => p
                        .with(hp => hp.base(0, 1).normal(0, -1))
                        .with(hp => hp.base(0, 1).normal(1, -1))));
                });

                describe("and then adds another point at infinity that is not in the same half plane", () => {

                    beforeEach(() => {
                        areaBuilder.addInfinityInDirection(new Point(-1, 1));
                    });

                    it("should have the entire plane as area", () => {
                        expectAreasToBeEqual(areaBuilder.area, plane);
                    });
                });
            });

            describe("and then adds another point at infinity between the two existing", () => {

                beforeEach(() => {
                    areaBuilder.addInfinityInDirection(new Point(1, -1));
                });

                it("should, when a point is added, end up with a polygon with one vertex", () => {
                    areaBuilder.addPoint(new Point(0, 1));
                    expectAreasToBeEqual(areaBuilder.area, p(p => p
                        .with(hp => hp.base(0, 1).normal(0, -1))
                        .with(hp => hp.base(0, 1).normal(1, 0))));
                });
            });
        });

        describe("and then adds a point at the opposite infinity", () => {

            beforeEach(() => {
                areaBuilder.addInfinityInDirection(new Point(-1, 0));
            });

            it("should, when a point is added, end up with a line", () => {
                areaBuilder.addPoint(new Point(0, 1));
                expectAreasToBeEqual(areaBuilder.area, l(l => l.base(0, 1).direction(1, 0)));
            });

            describe("and then adds a point at infinity on one side of the two existing", () => {

                beforeEach(() => {
                    areaBuilder.addInfinityInDirection(new Point(-1, -1));
                });

                it("should, when a point is added, end up with a half plane", () => {
                    areaBuilder.addPoint(new Point(0, 1));
                    expectAreasToBeEqual(areaBuilder.area, p(p => p.with(hp => hp.base(0, 1).normal(0, -1))));
                });
            });

            describe("and then adds a point at infinity on the other side of the two existing", () => {

                beforeEach(() => {
                    areaBuilder.addInfinityInDirection(new Point(0, 1));
                });

                it("should, when a point is added, end up with a half plane", () => {
                    areaBuilder.addPoint(new Point(0, 1));
                    expectAreasToBeEqual(areaBuilder.area, p(p => p.with(hp => hp.base(0, 1).normal(0, 1))));
                });
            });
        });
    });

    it.each(createStepData([
        [b => b.addPoint(new Point(0, 0)), empty],
        [b => b.addPoint(new Point(1, 0)), ls(ls => ls.from(0, 0).to(1, 0))],
        [b => b.addPoint(new Point(2, 0)), ls(ls => ls.from(0, 0).to(2, 0))],
        [b => b.addPoint(new Point(2, 2)), p(p => p
            .with(hp => hp.base(0, 0).normal(0, 1))
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(0, -1)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(0, 0).normal(1, -1))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(0, 1)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(2, 0).normal(-1, 0)))],
        [b => b.addPoint(new Point(3, 0)), p(p => p
            .with(hp => hp.base(0, 0).normal(1, 0))
            .with(hp => hp.base(3, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(-1, 0)), p(p => p
            .with(hp => hp.base(3, 0).normal(-1, 0)))],
        [b => b.addInfinityInDirection(new Point(1, 0)), plane]
    ]))("should have the correct area at each step", (instructions: ((builder: InfiniteCanvasAreaBuilder) => void)[], expectedArea: Area) => {
        for(let instruction of instructions){
            instruction(areaBuilder);
        }
        expectAreasToBeEqual(areaBuilder.area, expectedArea)
    });

    it.each(createStepData([
        [b => b.addPoint(new Point(0, 0)), empty],
        [b => b.addInfinityInDirection(new Point(0, 1)), r(r => r.base(0, 0).direction(0, 1))],
        [b => b.addInfinityInDirection(new Point(-1, 1)), p(p => p
            .with(hp => hp.base(0, 0).normal(-1, 0))
            .with(hp => hp.base(0, 0).normal(1, 1)))],
    ]))("should have the correct area at each step", (instructions: ((builder: InfiniteCanvasAreaBuilder) => void)[], expectedArea: Area) => {
        for(let instruction of instructions){
            instruction(areaBuilder);
        }
        expectAreasToBeEqual(areaBuilder.area, expectedArea)
    });

    it.each(createStepData([
        [b => b.addInfinityInDirection(new Point(1, 0)), empty],
        [b => b.addPoint(new Point(0, 0)), r(r => r.base(0, 0).direction(1, 0))]
    ]))("should have the correct area at each step", (instructions: ((builder: InfiniteCanvasAreaBuilder) => void)[], expectedArea: Area) => {
        for(let instruction of instructions){
            instruction(areaBuilder);
        }
        expectAreasToBeEqual(areaBuilder.area, expectedArea)
    });
});
