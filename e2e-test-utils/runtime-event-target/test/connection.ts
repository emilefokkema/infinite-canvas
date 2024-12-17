import { EventMessage } from "../shared/messages"
import { EventSource } from "./events/event-source"

export interface Connection {
    getEventMessages(): EventSource<EventMessage>
}