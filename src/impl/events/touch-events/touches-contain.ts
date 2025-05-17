export function touchesContain(list: TouchList, filter: (t: Touch) => boolean): boolean{
    for(let i = 0; i < list.length; i++){
        const touch = list[i];
        if(filter(touch)){
            return true;
        }
    }
    return false;
}