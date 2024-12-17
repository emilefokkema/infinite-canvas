import { Page } from "puppeteer";
import { ConnectionEventMessage } from "../shared/messages";
import { EventSource } from "./events/event-source";
import { sendEventFunctionName } from "../shared/constants";

export async function getConnectionEventMessages(page: Page): Promise<EventSource<ConnectionEventMessage>> {
    const listeners: ((e: ConnectionEventMessage) => void)[] = [];
    await page.exposeFunction(sendEventFunctionName, (e: ConnectionEventMessage) => notifyListeners(e))
    return {
        addListener(listener: (e: ConnectionEventMessage) => void){
            listeners.push(listener);
        },
        removeListener(listener: (e: ConnectionEventMessage) => void){
            const index = listeners.indexOf(listener);
            if(index === -1){
                return;
            }
            listeners.splice(index, 1);
        }
    }
    function notifyListeners(e: ConnectionEventMessage): void{
        for(const listener of listeners.slice()){
            listener(e);
        }
    }
}