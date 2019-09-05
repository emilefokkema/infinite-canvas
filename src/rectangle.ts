import { Point } from "./point";
import { Transformation } from "./transformation";

export class Rectangle{
    private vertices: Point[];
    public left: number;
    public right: number;
    public top: number;
    public bottom: number;
    constructor(x: number, y: number, width: number, height: number){
        this.vertices = [{x:x, y:y}, {x: x + width, y:y}, {x:x, y: y + height}, {x: x + width, y: y + height}];
        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }
    public transform(transformation: Transformation): Rectangle{
        const transformedVertices: Point[] = this.vertices.map(p => transformation.apply(p));
        const transformedX: number[] = transformedVertices.map(p => p.x);
        const transformedY: number[] = transformedVertices.map(p => p.y);
        const x: number = Math.min(...transformedX);
        const y: number = Math.min(...transformedY);
        const width: number = Math.max(...transformedX) - x;
        const height: number = Math.max(...transformedY) - y;
        return new Rectangle(x, y, width, height);
    }
    public intersects(other: Rectangle): boolean{
        return this.left <= other.right && 
               this.right >= other.left &&
               this.bottom >= other.top &&
               this.top <= other.bottom;
    }
}