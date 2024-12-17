import type { EventMessage } from "../../../shared/messages";

export interface MessageTarget {
    send(message: EventMessage): void;
}