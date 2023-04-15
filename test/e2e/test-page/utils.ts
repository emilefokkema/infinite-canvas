import {JSHandle, Serializable, JSEvalable, Page} from 'puppeteer';
import { AsyncResultProviders, EventListenerProxies } from './proxies';
import { EventListenerSequenceOnE2ETestPage, AsyncResult } from './page/interfaces';

export type WithFunctionsAsStrings<T> = T extends Function 
    ? string
    : T extends Serializable
        ? T
        : {[K in keyof T]: WithFunctionsAsStrings<T[K]>}

type ArgsWithFunctionsAsStrings<TArgs extends unknown[]> = {[K in keyof TArgs]: WithFunctionsAsStrings<TArgs[K]>};
type JSHandles<T extends unknown[]> = {[K in keyof T]: JSHandle<T[K]>};

function convertFunctionsToStrings<T>(input: T): WithFunctionsAsStrings<T>{
    if(typeof input === 'function'){
        return <WithFunctionsAsStrings<T>>`(${input})`;
    }
    if(typeof input !== 'object'){
        return <WithFunctionsAsStrings<T>>input;
    }
    if(Array.isArray(input)){
        const arrayResult = [];
        for(let inputItem of input){
            arrayResult.push(convertFunctionsToStrings(inputItem))
        }
        return <WithFunctionsAsStrings<T>>arrayResult;
    }
    const result: any = {};
    for(let key in input){
        result[key] = convertFunctionsToStrings(input[key]);
    }
    return result;
}

export function evaluate<T, TArgs extends unknown[], TResult, THandleType extends JSHandle<unknown> = JSHandle<TResult extends PromiseLike<infer U> ? U : TResult>>(
    evalable: JSEvalable<T>,
    fn: (arg1: T, ...convertedArgs: ArgsWithFunctionsAsStrings<TArgs>) => TResult,
    ...args: TArgs): Promise<THandleType>{
        return evalable.evaluateHandle<THandleType>(fn, ...args.map(a => convertFunctionsToStrings(a)));
}

export function evaluateOnPage<TArgs extends unknown[], TResult>(
    page: Page,
    fn: (...convertedArgs: ArgsWithFunctionsAsStrings<TArgs>) => TResult,
    ...args: TArgs): Promise<JSHandle<TResult extends PromiseLike<infer U> ? U : TResult>>{
        return page.evaluateHandle(<any>fn, ...args.map(a => convertFunctionsToStrings(a)));
}

export function evaluateWithHandles<TOriginal, TPageResult, TArgs extends unknown[]>(
    evalable: JSEvalable<TOriginal>,
    fn: (arg1: TOriginal, ...otherArgs: TArgs) => TPageResult,
    ...args: JSHandles<TArgs>
): Promise<TPageResult extends PromiseLike<infer U> ? U : TPageResult>{
    return evalable.evaluate(fn, ...args);
}

export async function getResultAfter<TResults extends unknown[]>(fn: () => Promise<any>, ...resultProviders: AsyncResultProviders<TResults>): Promise<TResults>{
    const asyncResultHandles = await Promise.all(resultProviders.map(p => p()));
    await fn();
    return <TResults>(await Promise.all(asyncResultHandles.map(h => h.evaluate(r => r.promise))));
}

export async function getNextInTurn<TEvents extends [unknown, ...unknown[]]>(...listeners: EventListenerProxies<TEvents>): Promise<JSHandle<AsyncResult<TEvents>>>{
    let sequence: JSHandle<EventListenerSequenceOnE2ETestPage>;
    for(let listener of listeners){
        if(!sequence){
            sequence = await listener.startSequence();
            continue;
        }
        await listener.addSelfToSequence(sequence);
    }
    return await sequence.evaluateHandle(s => s.getSequence());
}