import { EventListenerProxy } from "./proxies";
import { JSHandle } from "puppeteer";
import { EventListenerOnE2ETestPage, EventListenerSequenceOnE2ETestPage, AsyncResult } from "./page/interfaces";
import { evaluate, evaluateWithHandles } from "./utils";

export class EventListenerProxyImpl<T = any> implements EventListenerProxy<T>{
    constructor(private readonly handle: JSHandle<EventListenerOnE2ETestPage<T>>){

    }
    public startSequence(): Promise<JSHandle<EventListenerSequenceOnE2ETestPage>>{
        return evaluate(this.handle, h => h.startSequence());
    }
    public addSelfToSequence(sequence: JSHandle<EventListenerSequenceOnE2ETestPage>): Promise<void>{
        return evaluateWithHandles(this.handle, (listener, sequence) => sequence.addListener(listener), sequence)
    }
    public getNext(): Promise<JSHandle<AsyncResult<T>>>{
        return evaluate(this.handle, (listener) => listener.getNext());
    }
    public ensureNoNext(interval: number): Promise<JSHandle<AsyncResult<void>>>{
        return evaluate(this.handle, (listener, interval) => listener.ensureNoNext(interval), interval);
    }
}