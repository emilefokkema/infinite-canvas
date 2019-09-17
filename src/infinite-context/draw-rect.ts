import { Transformation } from "../transformation";

export function drawRect(
    _x:number,
    _y:number,
    w:number,
    h:number,
    context: CanvasRenderingContext2D,
    transformation: Transformation
): void{
    let x: number, y: number;
    ({x,y} = transformation.apply({x: _x, y: _y}));
    context.moveTo(x, y);
    ({x, y} = transformation.apply({x: _x + w, y: _y}));
    context.lineTo(x, y);
    ({x, y} = transformation.apply({x: _x + w, y: _y + h}));
    context.lineTo(x, y);
    ({x, y} = transformation.apply({x: _x, y: _y + h}));
    context.lineTo(x, y);
    ({x,y} = transformation.apply({x: _x, y: _y}));
    context.lineTo(x, y);
}