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
	public static identity(): Transformation{
		return new Transformation(1,0,0,1,0,0);
	}
	public static zoom(centerX: number, centerY: number, scale: number, translateX?: number, translateY?: number): Transformation{
		const oneMinScale: number = 1 - scale;
		if(translateX !== undefined){
			return new Transformation(scale, 0, 0, scale, centerX * oneMinScale + translateX, centerY * oneMinScale + translateY);
		}
		return new Transformation(scale, 0, 0, scale, centerX * oneMinScale, centerY * oneMinScale);
	}
	public static translateZoom(
		s1x: number,
		s1y: number,
		s2x: number,
		s2y: number,
		d1x: number,
		d1y: number,
		d2x: number,
		d2y: number): Transformation{
			const sdx: number = s2x - s1x;
			const sdy: number = s2y - s1y;
			const srsq = sdx * sdx + sdy * sdy;
			if(srsq === 0){
				throw new Error("divide by 0");
			}
			const ddx: number = d2x - d1x;
			const ddy: number = d2y - d1y;
			const drsq: number = ddx * ddx + ddy * ddy;
			const scale: number = Math.sqrt(drsq / srsq);
			return Transformation.zoom(s1x, s1y, scale, d1x - s1x, d1y - s1y);
	}
	public static translateRotateZoom(
		s1x: number,
		s1y: number,
		s2x: number,
		s2y: number,
		d1x: number,
		d1y: number,
		d2x: number,
		d2y: number): Transformation{
			const sdx: number = s2x - s1x;
			const sdy: number = s2y - s1y;
			const det: number = sdx * sdx + sdy * sdy;
			if(det === 0){
				throw new Error("divide by 0");
			}
			const ddx: number = d2x - d1x;
			const ddy: number = d2y - d1y;
			const g: number = s1x * s2y - s1y * s2x;
			const h: number = s2x * sdx + s2y * sdy;
			const i: number = s1x * sdx + s1y * sdy;
			const a: number = (sdx * ddx + sdy * ddy) / det;
			const b: number = (sdx * ddy - sdy * ddx) / det;
			const c: number = -b;
			const d: number = a;
			const e: number = (d1x * h - d2x * i - g * ddy) / det;
			const f: number = (d1y * h - d2y * i + g * ddx) / det;
			return new Transformation(a, b, c, d, e, f);
	}
}