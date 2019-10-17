import { Rectangle } from "./rectangle";
import { Point } from "./point";
import { Transformation } from "./transformation";
import { isPoint } from "./is-point";

export class AreaChange{
    constructor(public execute: (transformation: Transformation, previous?: Rectangle) => Rectangle){

    }
    public static to(to?: Point | Rectangle): AreaChange{
        return new AreaChange((transformation: Transformation, previous?: Rectangle) => {
            if(to){
                if(isPoint(to)){
                    to = transformation.apply(to);
                }else{
                    to = to.transform(transformation);
                }
            }
            if(previous){
                return to ? previous.expandToInclude(to) : previous;
            }else if(to){
                return Rectangle.create(to);
            }
            return undefined;
        });
    }
}