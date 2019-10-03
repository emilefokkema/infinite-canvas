import { ViewBox } from "../viewbox";
import { Transformation } from "../transformation";

export class InfiniteCanvasTransform implements CanvasTransform{
	constructor(private viewBox: ViewBox){}
	public getTransform(): DOMMatrix{
		if(DOMMatrix){
			const transformation: Transformation = this.viewBox.state.transformation;
			return new DOMMatrix([
				transformation.a,
				transformation.b,
				transformation.c,
				transformation.d,
				transformation.e,
				transformation.f
			]);
		}
		return undefined;
	}
	public resetTransform(): void{
		this.viewBox.changeState(state => state.setTransformation(Transformation.identity));
	}
	public rotate(angle: number): void{
		this.viewBox.changeState(state => state.addTransformation(Transformation.rotation(0, 0, angle)));
	}
	public scale(x: number, y: number): void{
		this.viewBox.changeState(state => state.addTransformation(new Transformation(x, 0, 0, y, 0, 0)));
	}
	public setTransform(a: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void{
		let _a: number,
			_b: number,
			_c: number,
			_d: number,
			_e: number,
			_f: number;
		if(typeof a === "number"){
			_a = a;
			_b = b;
			_c = c;
			_d = d;
			_e = e;
			_f = f;
		}else{
			if(a.a !== undefined){
				_a = a.a;
				_b = a.b;
				_c = a.c;
				_d = a.d;
				_e = a.e;
				_f = a.f;
			}else{
				_a = a.m11;
				_b = a.m12;
				_c = a.m21;
				_d = a.m22;
				_e = a.m41;
				_f = a.m42;
			}
		}
		this.viewBox.changeState(state => state.setTransformation(new Transformation(_a, _b, _c, _d, _e, _f)));
	}
	public transform(a: number, b: number, c: number, d: number, e: number, f: number): void{
		this.viewBox.changeState(state => state.addTransformation(new Transformation(a, b, c, d, e, f)))
	}
	public translate(x: number, y: number): void{
		this.viewBox.changeState(state => state.addTransformation(Transformation.translation(x, y)));
	}
}