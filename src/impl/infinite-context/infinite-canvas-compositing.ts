import { ViewBox } from "../interfaces/viewbox";
import { globalAlpha } from "../state/dimensions/global-alpha";
import { globalCompositeOperation } from "../state/dimensions/global-composite-operation";

export class InfiniteCanvasCompositing implements CanvasCompositing{
    constructor(private viewBox: ViewBox){}
	public get globalAlpha(): number{
        return this.viewBox.state.current.globalAlpha;
    }
    public set globalAlpha(value: number){
        this.viewBox.changeState(state => globalAlpha.changeInstanceValue(state, value));
    }
    public get globalCompositeOperation(): GlobalCompositeOperation{
        return this.viewBox.state.current.globalCompositeOperation;
    }
    public set globalCompositeOperation(value: GlobalCompositeOperation){
        this.viewBox.changeState(state => globalCompositeOperation.changeInstanceValue(state, value))
    }
}