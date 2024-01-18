import { from, take, map, firstValueFrom, throwError, timer, merge, switchMap, type Subscribable, type Observable } from 'rxjs'

const observableSymbol: typeof Symbol.observable = '@@observable' as any;

export interface Source<T>{
    addListener(listener: (value: T) => void): void
    removeListener(listener: (value: T) => void): void
}

export function fromSource<T>(source: Source<T>){
    const subscribable: Subscribable<T> = {
        subscribe(observer){
            const listener = (e: T) => observer.next(e);
            source.addListener(listener);
            return {
                unsubscribe(){
                    source.removeListener(listener)
                }
            }
        }
    };
    return from({
        [observableSymbol]: () => subscribable
    })
}

function getInTurn<TFirst, TOthers extends unknown[]>(first: Observable<TFirst>, ...others: {[Key in keyof TOthers]: Observable<TOthers[Key]>}): Observable<[TFirst, ...TOthers]>{
    const result = first.pipe(map(v => [v]));
    if(others.length === 0){
        return result as Observable<[TFirst, ...TOthers]>;
    }
    const [firstOther, ...otherOthers] = others;
    const othersInTurn = getInTurn(firstOther, ...otherOthers);
    return result.pipe(switchMap(([firstValue]) => othersInTurn.pipe(take(1), map((othersValue) => [firstValue, ...(othersValue as unknown as TOthers)] as [TFirst, ...TOthers]))))
}

export async function getNextInTurn<TFirst, TOthers extends unknown[]>(first: Source<TFirst>, ...others: {[Key in keyof TOthers]: Source<TOthers[Key]>}): Promise<[TFirst, ...TOthers]>{
    const inTurn = getInTurn(fromSource(first), ...others.map(o => fromSource(o)));
    return (await firstValueFrom(inTurn)) as [TFirst, ...TOthers];
}

export function getNext<T>(source: Source<T>): Promise<T>{
    return firstValueFrom(fromSource(source))
}

export async function ensureNoNext<T>(source: Observable<T>, interval: number, message?: (v: T) => string): Promise<void>{
    await firstValueFrom(
        merge(
            timer(interval),
            source.pipe(
                switchMap(
                    (e) => throwError(
                        () => new Error(`Expected no value for ${interval}, but received ${message ? message(e) : JSON.stringify(e)}`)
                        )
                    )
                )
        )
    )
}