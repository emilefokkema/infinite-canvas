import {Transformation} from "./transformation";

export abstract class InfiniteCanvasAuxiliaryObject{
    private numberOfTimesUsed: number = 0;
    protected constructor(private readonly onNoLongerUsed: () => void) {
    }
    public use(): void{
        this.numberOfTimesUsed += 1;
    }
    public stopUsing(): void{
        if(this.numberOfTimesUsed === 0){
            return;
        }
        this.numberOfTimesUsed -= 1;
        if(this.numberOfTimesUsed === 0){
            this.onNoLongerUsed();
        }
    }
    public abstract update(transformation: Transformation): void;
}