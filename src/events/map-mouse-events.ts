import { Transformer } from "../transformer/transformer"
import { AnchorSet } from "./anchor-set";
import { Anchor } from "../transformer/anchor";
import { Point } from "../point";

export function mapMouseEvents(
        canvasElement: HTMLCanvasElement,
        transformer: Transformer,
        anchorSet: AnchorSet,
        getRelativePosition: (clientX: number, clientY: number) => Point): void{
            let mouseAnchorIdentifier: number;
            function releaseAnchor(): void{
                if(mouseAnchorIdentifier !== undefined){
                    const anchor: Anchor = anchorSet.getAnchorByIdentifier(mouseAnchorIdentifier);
                    anchor.release();
                    anchorSet.removeAnchorByIdentifier(mouseAnchorIdentifier);
                    mouseAnchorIdentifier = undefined;
                }
            }
            canvasElement.addEventListener("mousedown", (ev: MouseEvent) => {
                if(mouseAnchorIdentifier !== undefined){
                    return;
                }
                let anchor: Anchor;
                const {x, y} = getRelativePosition(ev.clientX, ev.clientY);
                if(ev.button === 1){
                    if(!transformer.rotationEnabled){
                        return true;
                    }
                    anchor = transformer.getRotationAnchor(x, y);
                }else{
                    anchor = transformer.getAnchor(x, y);
                }
                mouseAnchorIdentifier = anchorSet.addAnchor(anchor);
                ev.preventDefault();
                return false;
            });
            canvasElement.addEventListener("mousemove", (ev: MouseEvent) => {
                if(mouseAnchorIdentifier !== undefined){
                    const {x, y} = getRelativePosition(ev.clientX, ev.clientY);
                    anchorSet.getAnchorByIdentifier(mouseAnchorIdentifier).moveTo(x, y);
                }
            });
            canvasElement.addEventListener("mouseup", (ev: MouseEvent) => {
                releaseAnchor();
            });
            canvasElement.addEventListener("mouseleave", (ev: MouseEvent) => {
                releaseAnchor();
            });
}