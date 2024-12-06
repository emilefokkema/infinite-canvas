import { ConnectionData } from "../shared/connection-data";

export interface ConnectionDataRepository{
    create(): Promise<ConnectionData>
    destroy(connectionData: ConnectionData): Promise<void>
}