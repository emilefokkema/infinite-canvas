import { WithFunctionsAsStrings } from "../utils";
import { FullInfiniteCanvasE2EInitialization } from "../shared/configuration";
import { InfiniteCanvasOnE2ETestPage } from "./interfaces";
import { initializeCanvas } from './initialize-canvas';

export function initializeInfiniteCanvas(config: WithFunctionsAsStrings<FullInfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage{
    const testCanvasElement = initializeCanvas(config);
    return testCanvasElement.initializeInfiniteCanvas(config);
}
