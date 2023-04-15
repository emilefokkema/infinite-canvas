import { Transformation } from "../transformation";

export class CoordinateSystem{
    public inverseBase: Transformation;
    constructor(public base: Transformation){
        this.inverseBase = base.inverse();
    }
    public getSimilarTransformation(input: Transformation): Transformation{
        return this.inverseBase.before(input).before(this.base);
    }
    public representSimilarTransformation(input: Transformation): Transformation{
        return this.base.before(input).before(this.inverseBase);
    }
    public representBase(base: Transformation): Transformation{
        return base.before(this.inverseBase);
    }
}