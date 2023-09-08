import type { Server } from 'http'
import { WebSocketServer, type WebSocket } from 'ws'

function connectWebSockets(ws1: WebSocket, ws2: WebSocket): void{
    ws1.addEventListener('message', (e) => ws2.send(e.data));
    ws1.addEventListener('close', () => ws2.close());
    ws2.addEventListener('message', (e) => ws1.send(e.data));
    ws2.addEventListener('close', () => ws1.close())
    const openMessage = {type: 'TESTING_MESSAGE_PORT_OPEN'};
    const messageString = JSON.stringify(openMessage);
    ws1.send(messageString);
    ws2.send(messageString);
}

export function connectTestingMessagePorts(server: Server): void{
    const webSocketServer = new WebSocketServer({noServer: true})
    const pendingSockets: {id: string, webSocket: WebSocket}[] = [];
    server.on('upgrade', (req, socket, head) => {
        const match = (req.url || '').match(/^\/testing-message-port\/(.*)$/)
        if(!match){
            return;
        }
        const [,id] = match;
        webSocketServer.handleUpgrade(req, socket, head, (ws) => {
            handleNewWebSocket(id, ws)
        })
    })

    function handleNewWebSocket(id: string, webSocket: WebSocket): void{
        const existing = findWebSocketById(id);
        if(existing){
            connectWebSockets(webSocket, existing);
        }else{
            pendingSockets.push({id, webSocket})
        }
    }

    function findWebSocketById(id: string): WebSocket | null{
        const index = pendingSockets.findIndex(p => p.id === id);
        if(index === -1){
            return null;
        }
        const [{webSocket}] = pendingSockets.splice(index, 1);
        return webSocket;
    }
}