import { EventSource } from "./event-source";

export class Dispatcher<T> implements EventSource<T>{
    public readonly listeners: ((ev: T) => void)[] = [];
    public addListener(listener: (ev: T) => void): void{
        this.listeners.push(listener);
    }
    public removeListener(listener: (ev: T) => void): void{
        const index = this.listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        this.listeners.splice(index, 1);
    }
    public dispatch(ev: T): void{
        const listenersToNotify = this.listeners.slice();
        for(let listenerToNotify of listenersToNotify){
            listenerToNotify(ev);
        }
    }
}