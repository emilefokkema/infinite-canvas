import { AnchorSet } from "./anchor-set";
import { Transformer } from "../transformer/transformer"
import { Anchor } from "../transformer/anchor";
import { Point } from "../point";

export function mapTouchEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    anchorSet: AnchorSet,
    getRelativePosition: (clientX: number, clientY: number) => Point){
        canvasElement.addEventListener("touchstart", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const {x,y} = getRelativePosition(changedTouch.clientX, changedTouch.clientY);
                const anchor: Anchor = transformer.getAnchor(x,y);
                anchorSet.addAnchor(anchor, changedTouch.identifier);
            }
            ev.preventDefault();
            return false;
        });
        canvasElement.addEventListener("touchmove", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const anchor: Anchor = anchorSet.getAnchorByExternalIdentifier(changedTouch.identifier);
                const {x,y} = getRelativePosition(changedTouch.clientX, changedTouch.clientY);
                anchor.moveTo(x, y);
            }
        });
        canvasElement.addEventListener("touchend", (ev: TouchEvent) => {
            const changedTouches: TouchList = ev.changedTouches;
            for(let i = 0; i <  changedTouches.length; i++){
                const changedTouch: Touch = changedTouches[i];
                const anchor: Anchor = anchorSet.getAnchorByExternalIdentifier(changedTouch.identifier);
                anchor.release();
                anchorSet.removeAnchorByExternalIdentifier(changedTouch.identifier);
            }
        });
}