import type { TransformationRepresentation } from "./transformation-representation";

export interface Transformed{
    /**
     * The transformation that, when applied to a point `(x, y)` in the CSS-pixel-base coordinate system of the `<canvas>` (which has its origin at the top-left corner of the canvas), returns the corresponding point in the {@link InfiniteCanvas}'s coordinate system
     */
    readonly transformation: TransformationRepresentation,
    /**
     * The inverse of {@link transformation}
     */
    readonly inverseTransformation: TransformationRepresentation
}

export * from './transformation-representation'