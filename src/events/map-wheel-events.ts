import { AnchorSet } from "./anchor-set";
import { Transformer } from "../transformer/transformer"
import { Point } from "../point";

export function mapWheelEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    anchorSet: AnchorSet,
    getRelativePosition: (clientX: number, clientY: number) => Point){
    canvasElement.addEventListener("wheel", (ev: WheelEvent) => {
        const {x, y} = getRelativePosition(ev.clientX, ev.clientY);
        let delta: number = ev.deltaY;
        if(Math.abs(delta) > 50){
            delta = delta / 10;
        }
        const scale: number = Math.pow(2, -delta / 100);
        transformer.zoom(x, y, scale);
        ev.preventDefault();
        return false;
    });
}