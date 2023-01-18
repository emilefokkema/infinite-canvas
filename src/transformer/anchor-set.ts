import { PointerAnchor } from "./pointer-anchor";
import { PointerAnchorImpl } from "./pointer-anchor-impl";

export class AnchorSet {
    private anchors: PointerAnchor[] = [];

    public find(predicate: (anchor: PointerAnchor) => boolean): PointerAnchor{
        return this.anchors.find(predicate);
    }
    public getAll(predicate: (anchor: PointerAnchor) => boolean): PointerAnchor[]{
        return this.anchors.filter(predicate);
    }
    public getAnchorForTouch(touchId: number): PointerAnchor{
        return this.anchors.find(a => a.touchId === touchId);
    }
    public addAnchorForPointerEvent(ev: PointerEvent): void{
        const anchor: PointerAnchor = new PointerAnchorImpl(ev);
        this.anchors.push(anchor);
    }
    public updateAnchorForPointerEvent(ev: PointerEvent): void{
        const anchor = this.getAnchorForPointerEvent(ev);
        if(!anchor){
            this.addAnchorForPointerEvent(ev);
            return;
        }
        anchor.updatePointerEvent(ev);
    }
    public getAnchorForPointerEvent(ev: PointerEvent): PointerAnchor{
        return this.anchors.find(r => r.pointerId === ev.pointerId);
    }
    public removeAnchor(anchor: PointerAnchor): void{
        const index: number = this.anchors.findIndex(r => r === anchor);
        if(index > -1){
            this.anchors.splice(index, 1);
        }
    }
}
