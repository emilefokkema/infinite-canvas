import { MoveSubscription } from "./move-subscription";
export interface Movable {
    onMoved(handler: () => void): MoveSubscription;
}
