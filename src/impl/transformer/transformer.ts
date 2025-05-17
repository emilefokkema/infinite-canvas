import {EventSource} from "../event-utils/event-source";
import { Anchor } from "./anchor";

export interface Transformer{
	readonly transformationStart: EventSource<void>;
	readonly transformationChange: EventSource<void>;
	readonly transformationEnd: EventSource<void>;
	addAnchor(anchor: Anchor): void;
	addRotationAnchor(anchor: Anchor): void;
	zoom(x: number, y: number, scale: number): void;
	releaseAnchor(anchor: Anchor): void;
}
