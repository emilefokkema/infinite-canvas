import { default as express, type Router} from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import { build } from 'vite'
import { Server } from 'http'
import { Options } from '../shared/options'
import { ConnectionSide } from '../shared/connection-side'
import { ConnectionData } from '../shared/connection-data'
import { TestSideConnectedMessage } from '../shared/messages'
import { createConfig } from '../frontend/lib/create-vite-config'
import { distPath } from '../frontend/lib/constants'
import { FRONTEND_PATH, CONNECTIONS_PATH } from '../shared/constants'

export interface RuntimeEventTargetBackend{
    router: Router
}

function connectSockets(testSideSocket: WebSocket, pageSideSocket: WebSocket): void{
    pageSideSocket.addEventListener('message', (e) => testSideSocket.send(e.data))
    const testSideConnectedMessage: TestSideConnectedMessage = {type: 'testsideconnected'}
    pageSideSocket.send(JSON.stringify(testSideConnectedMessage))
}

class Connection{
    private testSideSocket: WebSocket | undefined
    private pageSideSocket: WebSocket | undefined
    public constructor(public id: string){}

    public setTestSideSocket(socket: WebSocket): void{
        this.testSideSocket = socket;
        if(this.pageSideSocket){
            connectSockets(socket, this.pageSideSocket)
        }
    }
    public setPageSideSocket(socket: WebSocket): void{
        this.pageSideSocket = socket;
        if(this.testSideSocket){
            connectSockets(this.testSideSocket, socket);
        }
    }
    public close(): void{
        this.testSideSocket?.close();
        this.pageSideSocket?.close();
    }
}

function createConnections(server: Server, {publicPath}: Options): {router: Router}{
    const router = express.Router();
    let connectionId = 0;
    const connections: Connection[] = [];
    const webSocketServer = new WebSocketServer({noServer: true})
    const socketPathRegexp = new RegExp(`^/${publicPath}/${CONNECTIONS_PATH}/(test|page)/(\\d+)$`)

    server.on('upgrade', (req, socket, head) => {
        const match = (req.url || '').match(socketPathRegexp)
        if(!match){
            return;
        }
        const side = match[1] as ConnectionSide;
        const id = match[2];
        const connection = connections.find(c => c.id === id);
        if(!connection){   
            return;
        }
        webSocketServer.handleUpgrade(req, socket, head, (ws) => {
            if(side === 'test'){
                connection.setTestSideSocket(ws)
            }else{
                connection.setPageSideSocket(ws)
            }
        })
    })
    router.post('/', (req, res) => {
        const newId = `${connectionId++}`;
        const connection = new Connection(newId);
        connections.push(connection)
        const result: ConnectionData = {id: newId};
        res.json(result)
    })
    router.delete('/:id', (req, res) => {
        const connectionId = req.params.id;
        const index = connections.findIndex(c => c.id === connectionId);
        if(index > -1){
            const [connection] = connections.splice(index, 1);
            connection.close();
        }
        res.status(200).end();
    })
    return { router }
}

export async function createBackend(server: Server, options: Options): Promise<RuntimeEventTargetBackend>{
    await build(createConfig());
    const router = express.Router();
    const { router: connectionsRouter } = createConnections(server, options);
    router.use(`/${FRONTEND_PATH}`, express.static(distPath))
    router.use(`/${CONNECTIONS_PATH}`, connectionsRouter)
    return { router }
}