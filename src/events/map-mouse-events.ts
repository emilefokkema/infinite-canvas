import { Transformer } from "../transformer/transformer"
import { AnchorSet } from "./anchor-set";
import { Anchor } from "../transformer/anchor";

export function mapMouseEvents(canvasElement: HTMLCanvasElement, transformer: Transformer, anchorSet: AnchorSet): void{
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
        const anchor: Anchor = transformer.getAnchor(ev.clientX, ev.clientY);
        mouseAnchorIdentifier = anchorSet.addAnchor(anchor);
    });
    canvasElement.addEventListener("mousemove", (ev: MouseEvent) => {
        if(mouseAnchorIdentifier !== undefined){
            anchorSet.getAnchorByIdentifier(mouseAnchorIdentifier).moveTo(ev.clientX, ev.clientY);
        }
    });
    canvasElement.addEventListener("mouseup", (ev: MouseEvent) => {
        releaseAnchor();
    });
    canvasElement.addEventListener("mouseleave", (ev: MouseEvent) => {
        releaseAnchor();
    });
}