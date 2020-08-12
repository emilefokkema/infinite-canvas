export declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    mod(): number;
    modSq(): number;
    minus(other: Point): Point;
    plus(other: Point): Point;
    dot(other: Point): number;
    cross(other: Point): number;
    equals(other: Point): boolean;
    getPerpendicular(): Point;
    scale(r: number): Point;
    projectOn(other: Point): Point;
    matrix(a: number, b: number, c: number, d: number): Point;
    inSameDirectionAs(other: Point): boolean;
    isInOppositeDirectionAs(other: Point): boolean;
    isOnSameSideOfOriginAs(other1: Point, other2: Point): boolean;
    isInSmallerAngleBetweenPoints(point1: Point, point2: Point): boolean;
    static origin: Point;
}
