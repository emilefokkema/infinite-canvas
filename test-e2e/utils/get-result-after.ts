type PromiseFns<TResult extends unknown[]> = {[K in keyof TResult]: () => Promise<TResult[K]>}

export async function getResultAfter<TResult extends unknown[]>(fn: () => Promise<void>, ...fn2: PromiseFns<TResult>): Promise<TResult>{
    const resultPromise = Promise.all(fn2.map(f => f()));
    await fn();
    return <TResult>(await resultPromise);
}