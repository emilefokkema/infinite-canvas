import { imageSmoothingEnabled } from "../state/dimensions/image-smoothing-enabled";
import { ViewBox } from "../interfaces/viewbox";
import { imageSmoothingQuality } from "../state/dimensions/image-smoothing-quality";

export class InfiniteCanvasImageSmoothing implements CanvasImageSmoothing{
    constructor(private readonly viewBox: ViewBox){}
	public get imageSmoothingEnabled(): boolean{
        return this.viewBox.state.current.imageSmoothingEnabled;
    }
    public set imageSmoothingEnabled(value: boolean){
        this.viewBox.changeState(state => imageSmoothingEnabled.changeInstanceValue(state, value))
    }
    public get imageSmoothingQuality(): ImageSmoothingQuality{
        return this.viewBox.state.current.imageSmoothingQuality;
    }
    public set imageSmoothingQuality(value: ImageSmoothingQuality){
        this.viewBox.changeState(state => imageSmoothingQuality.changeInstanceValue(state, value))
    }
}