import { PathInfinityProvider } from "../src/interfaces/path-infinity-provider";
import { InfiniteCanvasState } from "../src/state/infinite-canvas-state";
import { ViewboxInfinity } from "../src/interfaces/viewbox-infinity";
import { FakeViewboxInfinity } from "./fake-viewbox-infinity";

export class FakePathInfinityProvider implements PathInfinityProvider{
    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity {
        return new FakeViewboxInfinity();
    }
    addDrawnLineWidth(lineWidth: number): void {
    }
    addLineDashPeriod(lineDashPeriod: number): void {
    }
}
