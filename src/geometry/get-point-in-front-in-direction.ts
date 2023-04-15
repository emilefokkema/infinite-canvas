import { Point } from "./point";

export function getPointInFrontInDirection(shape: Point[], point: Point, direction: Point){
    let along: number = 0;
    let frontMostVertex: Point;
    for(let shapePoint of shape){
        const newAlong: number = shapePoint.minus(point).dot(direction);
        if(newAlong > along){
            frontMostVertex = shapePoint;
            along = newAlong;
        }
    }
    if(frontMostVertex){
        return point.plus(frontMostVertex.minus(point).projectOn(direction));
    }
    return point;
}