import { Anchor } from "./anchor"

export interface Transformer{
	rotationEnabled: boolean;
	getAnchor(x: number, y:number): Anchor;
}