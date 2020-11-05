import { Movable } from "./movable";
import { MoveSubscription } from "./move-subscription";
import { Transformation } from "../transformation";
import { TransformableBox } from "../interfaces/transformable-box";
import {Transformable} from "../transformable";

export class Rotate{
    private point: MoveSubscription;
    private angularVelocity: number;
    private initialTransformation: Transformation;
    constructor(movable: Movable, private readonly transformable: Transformable){
        this.initialTransformation = transformable.transformation;
        this.angularVelocity = Math.PI / 100;
        this.point = movable.onMoved(() => {
            this.setTransformation();
        });
    }
    private setTransformation(): void{
        this.transformable.transformation = this.initialTransformation.before(Transformation.rotation(
            this.point.initial.x,
            this.point.initial.y,
            (this.point.initial.x - this.point.current.x) * this.angularVelocity));
    }
    public end(): void{
        this.point.cancel();
    }
}
