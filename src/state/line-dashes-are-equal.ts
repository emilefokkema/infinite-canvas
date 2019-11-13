export function lineDashesAreEqual(one: number[], other: number[]): boolean{
    if(one.length !== other.length){
        return false;
    }
    for(let i=0; i<one.length;i++){
        if(one[i] !== other[i]){
            return false;
        }
    }
    return true;
}