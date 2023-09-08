export class EventDispatcher<T extends unknown[]>{
    private listeners: ((...args: T) => void)[] = [];
    public addListener(listener: (...args: T) => void): void{
        this.listeners.push(listener)
    }
    public removeListener(listener: (...args: T) => void){
        const index = this.listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        this.listeners.splice(index, 1);
    }
    public dispatch(...args: T): void{
        for(let listener of this.listeners.slice()){
            listener(...args)
        }
    }
}