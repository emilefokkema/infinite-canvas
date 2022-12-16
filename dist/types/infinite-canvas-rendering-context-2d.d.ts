/**
 * This interface inherits all properties and methods from [`CanvasRenderingContext2D`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
 *
 * @remarks
 * `InfiniteCanvasRenderingContext2D` currently does **not** support [`getImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData), [`createImageData()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData), [`globalAlpha`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha), [`globalCompositeOperation`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), [`isPointInPath()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInPath), [`isPointInStroke()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/isPointInStroke), [`filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter), [`imageSmoothingEnabled`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled), [`imageSmoothingQuality`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality), [`lineJoin`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [`miterLimit`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit), [`drawFocusIfNeeded()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawFocusIfNeeded) and [`scrollPathIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scrollPathIntoView)
 */
export interface InfiniteCanvasRenderingContext2D extends CanvasRenderingContext2D {
    /**
     * Modifies the current sub-path by adding a ray that starts at the sub-path's last point and extends to infinity in the direction of a given vector
     * @param x The horizontal component of the vector that indicates the direction of the line
     * @param y The vertical component of the vector that indicates the direction of the line
     */
    lineToInfinityInDirection(x: number, y: number): void;
    /**
     * Begins a new sub-path at a 'point at infinity' that lies in the direction indicated by a given vector
     * @param x The horizontal component of the vector that indicates the direction of the 'point at infinity' at which to begin a new sub-path
     * @param y The vertical component of the vector that indicates the direction of the 'point at infinity' at which to begin a new sub-path
     */
    moveToInfinityInDirection(x: number, y: number): void;
}
