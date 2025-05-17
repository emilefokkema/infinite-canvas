export function toTouchesArray(list: TouchList, filter?: (t: Touch) => boolean): Touch[]{
    const result: Touch[] = [];
    for(let i = 0; i < list.length; i++){
        const touch = list[i];
        if(!filter || filter(touch)){
            result.push(touch);
        }
    }
    return result;
}