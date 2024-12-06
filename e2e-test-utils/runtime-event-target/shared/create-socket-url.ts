import { Options } from './options'
import { CONNECTIONS_PATH } from './constants'
import { ConnectionData } from './connection-data'
import { ConnectionSide } from './connection-side'

export function createSocketUrl(options: Options, side: ConnectionSide, connectionData: ConnectionData): string{
    const url = new URL(`${options.publicPath}/${CONNECTIONS_PATH}/${side}/${connectionData.id}`, options.baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return url.toString();
}