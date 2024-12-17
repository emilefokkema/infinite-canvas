import { ConnectionData } from "../shared/connection-data";

export interface ConnectionDataRepository{
    create(): ConnectionData
}