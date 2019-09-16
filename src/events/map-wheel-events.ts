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
        const scale: number = Math.pow(2, -delta / 300);
        transformer.zoom(x, y, scale);
        ev.preventDefault();
        return false;
    });
}