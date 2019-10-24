import { Point } from "./point";
import { Transformation } from "./transformation";
import { isPoint } from "./is-point";
import { PathInstructions } from "./instructions/path-instructions";
import { PathInstruction } from "./interfaces/path-instruction";

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
    public expandToInclude(pointOrRectangle: Point | Rectangle): Rectangle{
        let maxLeft: number;
        let minRight: number;
        let maxTop: number;
        let minBottom: number;
        if(isPoint(pointOrRectangle)){
            maxLeft = pointOrRectangle.x;
            minRight = pointOrRectangle.x;
            maxTop = pointOrRectangle.y;
            minBottom = pointOrRectangle.y;
        }else{
            maxLeft = pointOrRectangle.left;
            minRight = pointOrRectangle.right;
            maxTop = pointOrRectangle.top;
            minBottom = pointOrRectangle.bottom;
        }
        const left: number = Math.min(maxLeft, this.left);
        const right: number = Math.max(minRight, this.right);
        const top: number = Math.min(maxTop, this.top);
        const bottom: number = Math.max(minBottom, this.bottom);
        return new Rectangle(left, top, right - left, bottom - top);
    }
    public getInstructionToClear(): PathInstruction{
        const x: number = this.left;
        const y: number = this.top;
        const width: number = this.right - this.left;
        const height: number = this.bottom - this.top;
        return PathInstructions.clearRect(x, y, width, height);
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
    public contains(other: Rectangle): boolean{
        return this.left <= other.left &&
               this.right >= other.right &&
               this.top <= other.top &&
               this.bottom >= other.bottom;
    }
    public static create(area: Point | Rectangle): Rectangle{
        if(isPoint(area)){
            return new Rectangle(area.x, area.y, 0, 0);
        }
        return area;
    }
}