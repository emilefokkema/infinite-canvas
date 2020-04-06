import { AnchorSet } from "./anchor-set";
import { Transformer } from "../transformer/transformer"
import { Anchor } from "../transformer/anchor";
import { Point } from "../geometry/point";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";

export function mapTouchEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    anchorSet: AnchorSet,
    getRelativePosition: (clientX: number, clientY: number) => Point,
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
                if(anchorSet.getAnchorByExternalIdentifier(identifier)){
                    continue;
                }
                const {x,y} = getRelativePosition(touch.clientX, touch.clientY);
                const anchor: Anchor = transformer.getAnchor(x,y);
                anchorSet.addAnchor(anchor, identifier);
            }
            ev.preventDefault();
            return false;
        });
        canvasElement.addEventListener("touchmove", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const anchor: Anchor = anchorSet.getAnchorByExternalIdentifier(changedTouch.identifier);
                if(!anchor){
                    continue;
                }
                const {x,y} = getRelativePosition(changedTouch.clientX, changedTouch.clientY);
                anchor.moveTo(x, y);
            }
        });
        canvasElement.addEventListener("touchend", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const anchor: Anchor = anchorSet.getAnchorByExternalIdentifier(changedTouch.identifier);
                if(!anchor){
                    continue;
                }
                anchor.release();
                anchorSet.removeAnchorByExternalIdentifier(changedTouch.identifier);
            }
        });
}