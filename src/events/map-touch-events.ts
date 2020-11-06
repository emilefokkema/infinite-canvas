import { Transformer } from "../transformer/transformer"
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export function mapTouchEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    rectangle: CanvasRectangle,
    config: InfiniteCanvasConfig){
        canvasElement.addEventListener("touchstart", (ev: TouchEvent) => {
            const touches: TouchList = ev.touches;
            if(touches.length === 1 && !config.greedyGestureHandling){
                return true;
            }
            if(!ev.cancelable){
                console.log("touchstart event was not cancelable");
                return true;
            }
            for(let i = 0; i <  touches.length; i++){
                const touch: Touch = touches[i];
                const identifier: number = touch.identifier;
                const {x,y} = rectangle.getCSSPosition(touch.clientX, touch.clientY);
                transformer.createAnchorByExternalIdentifier(identifier, x, y);
            }
            ev.preventDefault();
            return false;
        });
        canvasElement.addEventListener("touchmove", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const {x,y} = rectangle.getCSSPosition(changedTouch.clientX, changedTouch.clientY);
                transformer.moveAnchorByExternalIdentifier(changedTouch.identifier, x, y);
            }
        });
        canvasElement.addEventListener("touchend", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                transformer.releaseAnchorByExternalIdentifier(changedTouch.identifier);
            }
        });
}
