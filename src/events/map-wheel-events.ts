import { Transformer } from "../transformer/transformer"
import { Config } from "../api-surface/config";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export function mapWheelEvents(
    canvasElement: HTMLCanvasElement,
    transformer: Transformer,
    rectangle: CanvasRectangle,
    config: Config){
    canvasElement.addEventListener("wheel", (ev: WheelEvent) => {
        if(!config.greedyGestureHandling && !ev.ctrlKey){
            return true;
        }
        const {x, y} = rectangle.getCSSPosition(ev.clientX, ev.clientY);
        let delta: number = ev.deltaY;
        const scale: number = Math.pow(2, -delta / 300);
        transformer.zoom(x, y, scale);
        ev.preventDefault();
        return false;
    });
}
