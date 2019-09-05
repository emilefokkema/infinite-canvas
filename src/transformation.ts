import { Point } from "./point"

export class Transformation{
	constructor(
		public a: number,
		public b: number,
		public c: number,
		public d: number,
		public e: number,
		public f: number
		){
	}
	public apply(point: Point): Point{
		return {
			x: this.a * point.x + this.c * point.y + this.e,
			y: this.b * point.x + this.d * point.y + this.f
		};
	}
	public before(other: Transformation): Transformation{
		const a: number = other.a * this.a + other.c * this.b;
		const b: number = other.b * this.a + other.d * this.b;
		const c: number = other.a * this.c + other.c * this.d;
		const d: number = other.b * this.c + other.d * this.d;
		const e: number = other.a * this.e + other.c * this.f + other.e;
		const f: number = other.b * this.e + other.d * this.f + other.f;
		return new Transformation(a, b, c, d, e, f);
	}
	public inverse(): Transformation{
		var det = this.a * this.d - this.b * this.c;
		if(det == 0){
			throw "error calculating inverse: zero determinant";
		}
		const a: number = this.d / det,
			b: number = - this.b / det,
			c: number = - this.c / det,
			d: number = this.a / det,
			e: number = (this.c * this.f - this.d * this.e) / det,
			f: number = (this.b * this.e - this.a * this.f) / det;
		return new Transformation(a,b,c,d,e,f);
	}
	public static translation(dx: number, dy: number): Transformation{
		return new Transformation(1, 0, 0, 1, dx, dy);
	}
	public static scale(scale: number): Transformation{
		return new Transformation(scale, 0, 0, scale, 0, 0);
	}
	public static zoom(centerX: number, centerY: number, scale: number): Transformation{
		return Transformation.translation(-centerX, -centerY).before(
				Transformation.scale(scale)).before(
				Transformation.translation(centerX, centerY));
	}
}