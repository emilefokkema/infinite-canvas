import {Transformation} from "../../transformation";

export class CoordinateSystem{
    constructor(public readonly base: Transformation, public inverseBase: Transformation) {
    }
    public representTransformation(transformation: Transformation): Transformation{
        return this.base.before(transformation).before(this.inverseBase);
    }
    public inverseRepresentTransformation(transformation: Transformation): Transformation{
        return this.inverseBase.before(transformation).before(this.base);
    }
    public static identity: CoordinateSystem = new CoordinateSystem(Transformation.identity, Transformation.identity);
}
