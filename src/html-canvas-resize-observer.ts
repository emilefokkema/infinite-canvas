import {CanvasResizeObserver} from "./canvas-resize-observer";

declare class ResizeObserver{
    constructor(callback: () => void);
    observe(target: Element): void;
    disconnect(): void;
}

export class HtmlCanvasResizeObserver implements CanvasResizeObserver{
    private listeners: (() => void)[];
    private observer: ResizeObserver;
    constructor(private readonly canvas: HTMLCanvasElement) {
        this.listeners = [];
    }
    private notifyListeners(): void{
        for(let listener of this.listeners){
            listener();
        }
    }
    private createObserver(): void{
        this.observer = new ResizeObserver(() => this.notifyListeners());
        this.observer.observe(this.canvas);
    }
    public addListener(listener: () => void): void {
        this.listeners.push(listener);
        if(!this.observer){
            this.createObserver();
        }
    }

    public removeListener(listener: () => void): void {
        const index: number = this.listeners.indexOf(listener);
        if(index > -1){
            this.listeners.splice(index, 1);
            if(this.listeners.length === 0){
                this.observer.disconnect();
                this.observer = undefined;
            }
        }
    }

}
