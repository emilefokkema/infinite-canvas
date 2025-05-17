import { PointAtInfinity } from "../../../geometry/point-at-infinity";
import { PathShape } from "../path-shape";
import { Transformation } from "../../../transformation";

export class AtInfinity implements PathShape<AtInfinity>{
    public readonly direction: 'clockwise' | 'counterclockwise'
    constructor(
        public readonly initialPosition: PointAtInfinity,
        public readonly surroundsFinitePoint: boolean,
        public readonly positionsSoFar: PointAtInfinity[],
        public readonly currentPosition: PointAtInfinity){
            const cross = initialPosition.direction.cross(currentPosition.direction);
            this.direction = surroundsFinitePoint ? cross >= 0 ? 'counterclockwise' : 'clockwise' : cross >= 0 ? 'clockwise' : 'counterclockwise';
        }
    public transform(transformation: Transformation){
        return new AtInfinity(
            transformation.applyToPointAtInfinity(this.initialPosition),
            this.surroundsFinitePoint,
            this.positionsSoFar.map(p => transformation.applyToPointAtInfinity(p)),
            transformation.applyToPointAtInfinity(this.currentPosition)
        );
    }

    public addPosition(position: PointAtInfinity): AtInfinity {
        const newDirectionOnSameSideOfOrigin: boolean = position.direction.isOnSameSideOfOriginAs(this.initialPosition.direction, this.currentPosition.direction);
        const newSurroundsFinitePoint: boolean = newDirectionOnSameSideOfOrigin ? this.surroundsFinitePoint : !this.surroundsFinitePoint;
        return new AtInfinity(this.initialPosition, newSurroundsFinitePoint, this.positionsSoFar.concat([position]), position)
    }

    public static create(position: PointAtInfinity): AtInfinity {
        return new AtInfinity(position, false, [position], position);
    }
}