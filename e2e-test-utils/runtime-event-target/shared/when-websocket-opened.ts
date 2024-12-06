import { WebSocketLike } from './websocket-like'

export function whenWebSocketOpened(socket: WebSocketLike): Promise<void>{
    return new Promise<void>((res, rej) => {
        const errorListener = (e: unknown): void => {
            removeListeners();
            rej(e);
        }
        const openListener = (): void => {
            removeListeners();
            res();
        } 
        socket.addEventListener('error', errorListener)
        socket.addEventListener('open', openListener)
        function removeListeners(): void{
            socket.removeEventListener('open', openListener)
            socket.removeEventListener('error', errorListener)
        }
    })
}