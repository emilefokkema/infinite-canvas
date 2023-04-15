export function sequence<TArgs extends unknown[]>(...fns: ((...args: TArgs) => void)[]): (...args: TArgs) => void{
    return (...args) => {
        for(const fn of fns){
            fn && fn(...args)
        }
    }
}