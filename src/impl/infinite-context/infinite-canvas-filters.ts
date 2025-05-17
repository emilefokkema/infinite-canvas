import { TransformableFilter } from "../state/dimensions/transformable-filter";
import { ViewBox } from "../interfaces/viewbox";
import { filter } from "../state/dimensions/filter";
import { CssLengthConverterFactory } from "../css-length-converter-factory";

export class InfinitCanvasFilters implements CanvasFilters{
	constructor(private viewBox: ViewBox, private readonly cssLengthConverterFactory: CssLengthConverterFactory){}
	public get filter(): string{
		return this.viewBox.state.current.filter.stringRepresentation;
	}
	public set filter(value: string){
		const transformableFilter = TransformableFilter.create(value, this.cssLengthConverterFactory.create());
		this.viewBox.changeState(state => filter.changeInstanceValue(state, transformableFilter));
	}
}