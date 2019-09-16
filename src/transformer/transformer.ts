import { Anchor } from "./anchor"

export interface Transformer{
	rotationEnabled: boolean;
	zoom(x: number, y: number, scale: number): void;
	getAnchor(x: number, y:number): Anchor;
	getRotationAnchor(x: number, y:number, angularVelocity: number): Anchor;
}