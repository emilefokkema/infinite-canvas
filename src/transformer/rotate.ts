import { Movable } from "./movable";
import { Transformable } from "../transformable";
import { MoveSubscription } from "./move-subscription";
import { Transformation } from "../transformation";

export class Rotate{
    private point: MoveSubscription;
    private initialTransformation: Transformation;
    constructor(movable: Movable, private readonly transformable: Transformable){
        this.initialTransformation = transformable.transformation;
        this.point = movable.onMoved(() => {
            this.setTransformation();
        });
    }
    private setTransformation(): void{
        this.transformable.transformation = this.initialTransformation.before(Transformation.rotation(
            this.point.initial.x,
            this.point.initial.y,
            (this.point.initial.x - this.point.current.x) / 100));
    }
    public end(): void{
        this.point.cancel();
    }
}