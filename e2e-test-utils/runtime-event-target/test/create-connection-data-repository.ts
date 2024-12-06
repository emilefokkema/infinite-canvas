import { ConnectionData } from "../shared/connection-data";
import { CONNECTIONS_PATH } from "../shared/constants";
import { Options } from "../shared/options";
import { ConnectionDataRepository } from "./connection-data-repository";

export function createConnectionDataRepository(options: Options): ConnectionDataRepository{
    return { create, destroy }
    async function create(): Promise<ConnectionData>{
        const connectionsUrl = new URL(`${options.publicPath}/${CONNECTIONS_PATH}`, options.baseUrl);
        const result = await fetch(connectionsUrl, {
            method: 'POST'
        })
        if(!result.ok){
            const text = await result.text();
            console.warn(text)
            throw new Error('Could not create connection data')
        }
        return await result.json();
    }

    async function destroy(connectionData: ConnectionData): Promise<void>{
        const connectionUrl = new URL(`${options.publicPath}/${CONNECTIONS_PATH}/${connectionData.id}`, options.baseUrl);
        const result = await fetch(connectionUrl, {
            method: 'DELETE'
        })
        if(!result.ok){
            const text = await result.text();
            console.warn(text)
            throw new Error('Could not delete connection data')
        }
    }
}