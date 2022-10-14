import { waitForNextDebouncedScrollEvent, getConfig, TestCanvas} from './test-page-utils.js';

window.waitForNextDebouncedScrollEvent = waitForNextDebouncedScrollEvent;
window.testCanvas = undefined;
window.createTestCanvas = function(canvasElement){
    const config = getConfig(new URL(location.href).searchParams);
    window.testCanvas = new TestCanvas(canvasElement, config);
};
window.executeCode = function(fn){
    return window.testCanvas.executeCode(fn);
}
