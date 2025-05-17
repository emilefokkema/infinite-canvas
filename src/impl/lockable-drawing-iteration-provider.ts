import { DrawingIterationProvider } from "./interfaces/drawing-iteration-provider";
import { DrawingLock } from "./drawing-lock";

export class LockableDrawingIterationProvider implements DrawingIterationProvider{
    private _draw: () => boolean;
    private _locks: DrawingLock[] = [];
    constructor(private readonly drawingIterationProvider: DrawingIterationProvider){

    }
    private removeLock(lock: DrawingLock): void{
        const index: number = this._locks.indexOf(lock);
        this._locks.splice(index, 1);
        if(this._locks.length === 0 && this._draw){
            this.drawingIterationProvider.provideDrawingIteration(this._draw);
        }
    }
    public provideDrawingIteration(draw: () => boolean): void{
        if(this._locks.length){
            this._draw = draw;
        }else{
            this.drawingIterationProvider.provideDrawingIteration(draw);
        }
    }
    public getLock(): DrawingLock{
        let lock: DrawingLock;
        lock = {release: () => {this.removeLock(lock);}};
        this._locks.push(lock);
        return lock;
    }
}