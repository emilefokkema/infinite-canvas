import { ConnectionData } from "../shared/connection-data";
import { ConnectionDataRepository } from "./connection-data-repository";

export function createConnectionDataRepository(): ConnectionDataRepository{
    let connectionId = 0;
    return {
        create(): ConnectionData {
            return {id: `${connectionId++}`};
        }
    }
}