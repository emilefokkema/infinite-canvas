import { MoveSubscription } from "./move-subscription";

export interface Anchor {
	readonly fixedOnInfiniteCanvas: boolean;
	moveTo(x: number, y: number): void;
	onMoved(handler: () => void, fixedOnInfiniteCanvas: boolean): MoveSubscription;
}