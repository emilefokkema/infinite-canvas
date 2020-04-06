import { ViewboxInfinityProvider } from "../src/interfaces/viewbox-infinity-provider";
import { PathInfinityProvider } from "../src/interfaces/path-infinity-provider";
import { FakePathInfinityProvider } from "./fake-path-infinity-provider";

export class FakeViewboxInfinityProvider implements ViewboxInfinityProvider{
    public getForPath(): PathInfinityProvider{
        return new FakePathInfinityProvider();
    }
}