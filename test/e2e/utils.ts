export function ensureDoesNotResolve(fn: () => Promise<void>, interval: number, message: string): Promise<void>{
    return new Promise((res, rej) => {
        let resolved = false;
        let timeoutElapsed = false;
        fn().then(() => {
            resolved = true;
            if(!timeoutElapsed){
                rej(new Error(message));
            }
        })
        setTimeout(() => {
            timeoutElapsed = true;
            if(!resolved){
                res();
            }
        }, interval)
    })
}