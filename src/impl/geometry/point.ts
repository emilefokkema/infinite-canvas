export class Point{
	constructor(public readonly x: number, public readonly y: number){}
	public mod(): number{
		return Math.sqrt(this.modSq());
	}
	public modSq(): number{
		return this.x * this.x + this.y * this.y;
	}
	public minus(other: Point): Point{
		return new Point(this.x - other.x, this.y - other.y);
	}
	public plus(other: Point): Point{
		return new Point(this.x + other.x, this.y + other.y);
	}
	public dot(other: Point): number{
		return this.x * other.x + this.y * other.y;
	}
	public cross(other: Point): number{
		return this.x * other.y - this.y * other.x;
	}
	public equals(other: Point): boolean{
		return this.x === other.x && this.y === other.y;
	}
	public getPerpendicular(): Point{
		return new Point(-this.y, this.x);
	}
	public scale(r: number): Point{
		return new Point(r * this.x, r * this.y);
	}
	public projectOn(other: Point): Point{
		return other.scale(this.dot(other) / other.modSq());
	}
	public matrix(a: number, b: number, c: number, d: number): Point{
		return new Point(a * this.x + b * this.y, c * this.x + d * this.y);
	}
	public inSameDirectionAs(other: Point): boolean{
		return this.cross(other) === 0 && this.dot(other) >= 0;
	}
	public isInOppositeDirectionAs(other: Point): boolean{
		return this.cross(other) === 0 && this.dot(other) < 0;
	}
	public isOnSameSideOfOriginAs(other1: Point, other2: Point){
		return this.isInSmallerAngleBetweenPoints(other1, other2) || 
			   other1.isInSmallerAngleBetweenPoints(this, other2) ||
			   other2.isInSmallerAngleBetweenPoints(this, other1);
	}
	public isInSmallerAngleBetweenPoints(point1: Point, point2: Point): boolean{
		const cross: number = point1.cross(point2);
		if(cross > 0){
			return point1.cross(this) >= 0 && this.cross(point2) >= 0;
		}else if(cross < 0){
			return point1.cross(this) <= 0 && this.cross(point2) <= 0;
		}else if(point1.dot(point2) > 0){
			return this.cross(point1) === 0 && this.dot(point1) > 0;
		}else{
			return true;
		}
	}
	public static origin: Point = new Point(0, 0);
}