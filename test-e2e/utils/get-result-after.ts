type AwaitedReturnType<T> = T extends () => unknown ? Awaited<ReturnType<T>> : never
type AwaitedReturnTypes<T extends readonly (() => unknown)[]> = { -readonly [P in keyof T]: AwaitedReturnType<T[P]>}

function withTimeout<T>(promise: Promise<T>, timeout: number, msg: string): Promise<T>{
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    const rejectingPromise: Promise<never> = new Promise((_, rej) => {
        timeoutId = setTimeout(() => rej(new Error(msg)), timeout)
    })
    const promiseThatClearsTimeout = promise.then(r => {
        if(timeoutId !== undefined){
            clearTimeout(timeoutId)
        }
        return r;
    })
    return Promise.race([promiseThatClearsTimeout, rejectingPromise])
}

export async function getResultAfter<T extends readonly (() => unknown)[]>(
    fn: () => Promise<void>,
    fn2: T,
    config?: {message?: string, timeout?: number}): Promise<AwaitedReturnTypes<T>>{
        const timeout = config?.timeout ?? 2000;
        const msg = config?.message || `Promise did not resolve after ${timeout}ms`
        const resultPromise = Promise.all(fn2.map(f => f()));
        await fn();
        return <AwaitedReturnTypes<T>>(await withTimeout(resultPromise, timeout, msg))
}