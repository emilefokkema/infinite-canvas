import {Position} from "./position";
import {isPointAtInfinity} from "./is-point-at-infinity";

export function positionsAreEqual(one: Position, other: Position): boolean{
    if(!one){
        return !other;
    }
    if(!other){
        return !one;
    }
    if(isPointAtInfinity(one)){
        return isPointAtInfinity(other) && one.direction.equals(other.direction);
    }
    return !isPointAtInfinity(other) && one.equals(other);
}