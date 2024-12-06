import { createSocketMessageListener } from "./create-socket-message-listener";
import { WebSocketLike } from "./websocket-like";

export function awaitMessageFromSocket<TMessage>(
    socket: WebSocketLike,
    predicate: (message: unknown) => message is TMessage): Promise<TMessage>{
        return new Promise<TMessage>((res) => {
            const listener = createSocketMessageListener(predicate, (msg) => {
                socket.removeEventListener('message', listener);
                res(msg);
            })
            socket.addEventListener('message', listener)
        })
}