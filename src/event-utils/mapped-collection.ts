export abstract class MappedCollection<TOriginal, TMapped>{
    protected mapped: TMapped[] = [];
    protected abstract mapsTo(mapped: TMapped, original: TOriginal): boolean;
    protected abstract map(original: TOriginal): TMapped;
    protected onRemoved(mapped: TMapped): void{}
    public add(original: TOriginal): void{
        if(this.mapped.some(m => this.mapsTo(m, original))){
            return;
        }
        this.mapped.push(this.map(original));
    }
    public remove(original: TOriginal): void{
        const index: number = this.mapped.findIndex(m => this.mapsTo(m, original));
        if(index === -1){
            return;
        }
        const [mapped] = this.mapped.splice(index, 1);
        this.onRemoved(mapped);
    }
}