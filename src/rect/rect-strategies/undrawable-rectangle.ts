import { Area } from '../../areas/area';
import { DrawingInstruction } from '../../drawing-instruction';
import { Dimension } from '../dimension';
import { Rect, Shape } from '../rect'
import { throwNoTopLeftLocationError } from './top-left-location-error';

export class UndrawableRectangle implements Rect{
    constructor(
        private readonly horizontal: Dimension,
        private readonly vertical: Dimension
    ){

    }
    public addSubpaths(): void{
        throwNoTopLeftLocationError(this.horizontal, this.vertical)
    }
    public getRoundRect(): Shape{
        return this;
    }

    public getArea(): Area {
        return undefined;
    }
    public stroke(): DrawingInstruction{
        return undefined;
    }
    public fill(): DrawingInstruction{
        return undefined;
    }
}