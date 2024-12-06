import type { Options } from '../../../shared/options'
import type { ConnectionData } from '../../../shared/connection-data'
import { awaitMessageFromSocket } from '../../../shared/await-message-from-socket'
import { createSocketUrl } from '../../../shared/create-socket-url'
import type { TestSideConnectedMessage, PageSideReadyMessage } from '../../../shared/messages'
import { whenWebSocketOpened } from '../../../shared/when-websocket-opened'

function isTestSideConnectedMessage(message: unknown): message is TestSideConnectedMessage{
    return !!message && (message as TestSideConnectedMessage).type === 'testsideconnected';
}

async function createSocket(options: Options, connectionData: ConnectionData): Promise<WebSocket>{
    const socketUrl = createSocketUrl(options, 'page', connectionData);
    const socket = new WebSocket(socketUrl);
    await Promise.all([
        whenWebSocketOpened(socket),
        awaitMessageFromSocket(socket, isTestSideConnectedMessage)
    ])
    const pageSideReadyMessage: PageSideReadyMessage = { type: 'pagesideready' };
    socket.send(JSON.stringify(pageSideReadyMessage));
    return socket;
}

export class Connection{
    private socket: WebSocket | undefined
    public constructor(
        private readonly options: Options,
        private readonly connectionData: ConnectionData
    ){}
    public async getSocket(): Promise<WebSocket>{
        if(this.socket){
            return this.socket;
        }
        const truthySocket = await createSocket(this.options, this.connectionData)
        this.socket = truthySocket;
        return truthySocket;
    }
}