import { TransformerContext } from "./transformer-context";
import { Transformation } from "../transformation";
import { Translate } from "./translate";
import { Gesture } from "./gesture";
import { TranslateZoom } from "./translate-zoom";
import { Transformable } from "../transformable";
import { Movable } from "./movable";
import { TranslateRotateZoom } from "./translate-rotate-zoom";

export class InfiniteCanvasTransformerContext implements TransformerContext{
    public rotationEnabled: boolean;
    constructor(private readonly transformable: Transformable){
        this.rotationEnabled = false;
    }
    public get transformation(): Transformation{
        return this.transformable.transformation;
    }
    public set transformation(value: Transformation){
        this.transformable.transformation = value;
    }
    public getGestureForOneMovable(movable: Movable): Gesture{
        return new Translate(movable, this);
    }
    public getGestureForTwoMovables(movable1: Movable, movable2: Movable): Gesture{
        if(this.rotationEnabled){
            return new TranslateRotateZoom(movable1, movable2, this);
        }
        return new TranslateZoom(movable1, movable2, this);
    }
}