import { Movable } from "./movable";
import { MoveSubscription } from "./move-subscription";
import { Transformation } from "../transformation";
import { ViewBox } from "../viewbox";

export class Rotate{
    private point: MoveSubscription;
    private angularVelocity: number;
    private initialTransformation: Transformation;
    constructor(movable: Movable, private readonly viewBox: ViewBox){
        this.initialTransformation = viewBox.transformation;
        this.angularVelocity = 4 * Math.PI / viewBox.width;
        this.point = movable.onMoved(() => {
            this.setTransformation();
        });
    }
    private setTransformation(): void{
        this.viewBox.transformation = this.initialTransformation.before(Transformation.rotation(
            this.point.initial.x,
            this.point.initial.y,
            (this.point.initial.x - this.point.current.x) * this.angularVelocity));
    }
    public end(): void{
        this.point.cancel();
    }
}