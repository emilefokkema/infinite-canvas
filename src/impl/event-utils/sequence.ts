import { EventSource } from './event-source';

class SequenceEventSource<T> implements EventSource<T>{
    constructor(private readonly sequence: T[]){

    }
    public addListener(listener: (event: T) => void, onRemoved?: () => void): void {
        for(const item of this.sequence){
            listener(item);
        }
        if(onRemoved){
            onRemoved();
        }
    }
    public removeListener(listener: (event: T) => void): void {
        
    }
}

export function sequence<T>(items: T[]): EventSource<T>{
    return new SequenceEventSource(items);
}