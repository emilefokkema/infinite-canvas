import { Observable, filter, firstValueFrom, fromEvent, map, merge, switchMap, take, throwError, timer } from "rxjs";
import { ConsoleMessage, Page } from "puppeteer";
import { EventTargetHandle } from "puppeteer-event-target-handle";

function eventsFromTarget<TMap, TType extends (keyof TMap) & string>(
    eventTarget: EventTargetHandle<unknown, TMap>,
    type: TType
): Observable<TMap[TType]>{
    return fromEvent(eventTarget, type)
}

function oneAfterOther<TOne, TOther>(
    one: Observable<TOne>,
    other: Observable<TOther>
): Observable<readonly [TOther, TOne]>{
    return other.pipe(
        switchMap(
            otherValue => one.pipe(
                map(oneValue => [otherValue, oneValue] as const),
                take(1)
            )
        )
    )
}

function makeSequence<TFirst, TOthers extends unknown[]>(
    first: Observable<TFirst>,
    ...others: {[key in keyof TOthers]: Observable<TOthers[key]>}
): Observable<readonly [TFirst, ...TOthers]>{
    if(others.length === 0){
        return first.pipe(map(v => [v] as unknown as [TFirst, ...TOthers]))
    }
    const [firstOther, ...otherOthers] = others;
    const otherSequence = makeSequence(firstOther, ...otherOthers) as unknown as Observable<TOthers>;
    return oneAfterOther(otherSequence, first).pipe(map(([first, others]) => [first, ...others]))
}

export type SequenceOfEvents<TMap, TTypes extends ((keyof TMap) & string)[]> = {
    [key in keyof TTypes]: TMap[TTypes[key]]
}

export function nextEventsInSequence<TMap, TTypes extends ((keyof TMap) & string)[]>(
    eventTarget: EventTargetHandle<unknown, TMap>,
    ...types: TTypes
): Promise<SequenceOfEvents<TMap, TTypes>>{
    if(types.length === 0){
        return Promise.resolve([] as SequenceOfEvents<TMap, TTypes>)
    }
    const [firstType, ...otherTypes] = types;
    const firstObs = eventsFromTarget(eventTarget, firstType);
    const otherObs = otherTypes.map(t => eventsFromTarget(eventTarget, t));
    const sequence = makeSequence(firstObs, ...otherObs);
    return firstValueFrom(sequence) as unknown as Promise<SequenceOfEvents<TMap, TTypes>>
}

export function nextEvent<TMap, TType extends (keyof TMap) & string>(
    eventTarget: EventTargetHandle<unknown, TMap>,
    type: TType): Promise<TMap[TType]>{
        return firstValueFrom(eventsFromTarget(eventTarget, type))
}

export function nextConsoleMessage(page: Page, predicate: (msg: ConsoleMessage) => boolean): Promise<ConsoleMessage>{
    const consoleMessages = fromEvent(page, 'console') as Observable<ConsoleMessage>;
    return firstValueFrom(consoleMessages.pipe(filter(predicate)));
}

async function noNext<TValue>(
    values: Observable<TValue>,
    interval: number,
    message?: (v: TValue) => string
): Promise<void>{
    await firstValueFrom(
        merge(
            timer(interval),
            values.pipe(
                switchMap(
                    (e) => throwError(
                        () => new Error(`Expected no value for ${interval}, but received ${message ? message(e) : JSON.stringify(e)}`)
                        )
                    )
                )
        )
    )
}

export function noConsoleMessage(
    page: Page,
    predicate: (msg: ConsoleMessage) => boolean,
    interval: number
): Promise<void>{
    const consoleMessages = fromEvent(page, 'console') as Observable<ConsoleMessage>;
    return noNext(consoleMessages.pipe(filter(predicate)), interval);
}

export async function noError(page: Page, interval: number): Promise<void>{
    const errors = fromEvent(page, 'pageerror') as Observable<Error>
    await noNext(errors, interval, error => error.message)
}

export async function noEvent<TMap, TType extends (keyof TMap) & string>(
    eventTarget: EventTargetHandle<unknown, TMap>,
    type: TType,
    interval: number,
    message?: (v: TMap[TType]) => string
): Promise<void>{
    const events = eventsFromTarget(eventTarget, type)
    await noNext(events, interval, message)
}