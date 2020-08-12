import { Anchor } from "./anchor";
export interface Transformer {
    zoom(x: number, y: number, scale: number): void;
    getAnchor(x: number, y: number): Anchor;
    getRotationAnchor(x: number, y: number): Anchor;
}
