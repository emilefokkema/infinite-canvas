import { EventListenerSequenceOnE2ETestPage, EventListenerOnE2ETestPage } from "./interfaces";
import { AsyncResult } from './async-result';

export class EventListenerSequence implements EventListenerSequenceOnE2ETestPage{
    private readonly listeners: EventListenerOnE2ETestPage[];
    constructor(listener: EventListenerOnE2ETestPage){
        this.listeners = [listener];
    }
    public addListener(eventListener: EventListenerOnE2ETestPage){
        this.listeners.push(eventListener);
    }
    public getSequence(): AsyncResult{
        return new AsyncResult(new Promise((res, rej) => {
            let waitingForEventIndex = 0;
            const attachedListeners: {remove: () => void}[] = [];
            const result: any[] = [];
            for(let i = 0; i < this.listeners.length; i++){
                const eventListener = this.listeners[i];
                const listener = (ev: any) => {
                    if(waitingForEventIndex < i){
                        removeAllListeners();
                        rej(new Error(`received unexpected event ${JSON.stringify(ev)} at index ${waitingForEventIndex}`));
                        return;
                    }
                    if(waitingForEventIndex > i){
                        return;
                    }
                    if(result.some(e => e === ev)){
                        return;
                    }
                    result.push(ev);
                    if(result.length === this.listeners.length){
                        removeAllListeners();
                        res(result);
                        return;
                    }
                    waitingForEventIndex++;
                };
                eventListener.addListener(listener);
                attachedListeners.push({remove: () => eventListener.removeListener(listener)})
            }
            function removeAllListeners(){
                for(let attachedListener of attachedListeners){
                    attachedListener.remove();
                }
            }
        }));
    }
}