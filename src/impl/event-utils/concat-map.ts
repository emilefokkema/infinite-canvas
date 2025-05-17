import { EventSource } from './event-source';
import { transform } from './transform';

export function concatMap<T, U>(source: EventSource<T>, mapFn: (ev: T) => EventSource<U>): EventSource<U>{
    return transform(source, listener => {
        let listening = false;
        const queue: T[] = [];
        function listenToNext(): void{
            if(listening || queue.length === 0){
                return;
            }
            listening = true;
            mapFn(queue.shift()).addListener(listener, () => {
                listening = false;
                listenToNext();
            });
        }
        return (ev) => {
            queue.push(ev);
            listenToNext();
        };
    });
}
