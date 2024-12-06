import WebSocket from 'ws'
import { PageSideReadyMessage } from '../shared/messages'
import { createSocketUrl } from '../shared/create-socket-url'
import { awaitMessageFromSocket } from '../shared/await-message-from-socket'
import { Options } from '../shared/options'
import { ConnectionData } from '../shared/connection-data'
import { whenWebSocketOpened } from '../shared/when-websocket-opened'
import { ConnectionDataRepository } from './connection-data-repository'

function isPageSideReadyMessage(message: unknown): message is PageSideReadyMessage{
    return !!message && (message as PageSideReadyMessage).type === 'pagesideready';
}

async function createSocket(options: Options, connectionData: ConnectionData): Promise<WebSocket>{
    const socketUrl = createSocketUrl(options, 'test', connectionData);
    const socket = new WebSocket(socketUrl);
    await Promise.all([
        whenWebSocketOpened(socket),
        awaitMessageFromSocket(socket, isPageSideReadyMessage)
    ])
    return socket;
}

export class Connection{
    private socket: WebSocket | undefined
    public constructor(
        private readonly options: Options,
        private readonly connectionDataRepository: ConnectionDataRepository,
        private readonly connectionData: ConnectionData
    ){}
    public async getSocket(): Promise<WebSocket>{
        if(this.socket){
            return this.socket;
        }
        const truthySocket =  await createSocket(this.options, this.connectionData);
        this.socket = truthySocket;
        return truthySocket;
    }
    public destroy(): Promise<void>{
        return this.connectionDataRepository.destroy(this.connectionData)
    }
}