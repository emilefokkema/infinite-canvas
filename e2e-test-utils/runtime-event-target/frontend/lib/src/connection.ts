import type { MessageTarget } from "./message-target";

export interface Connection {
    getMessageTarget(): MessageTarget
}