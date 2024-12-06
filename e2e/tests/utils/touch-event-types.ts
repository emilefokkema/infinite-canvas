export interface SerializedInfiniteCanvasTouch {
    infiniteCanvasX: number
    infiniteCanvasY: number
    radiusX: number
    radiusY: number
    rotationAngle: number
    identifier: number
}
export type SerializedInfiniteCanvasTouchList = {
    length: number
    [index: number]: SerializedInfiniteCanvasTouch
}
export interface SerializedInfiniteCanvasTouchEvent {
    touches: SerializedInfiniteCanvasTouchList
    targetTouches: SerializedInfiniteCanvasTouchList
    changedTouches: SerializedInfiniteCanvasTouchList
}
const touchMap = {
    infiniteCanvasX: true,
    infiniteCanvasY: true,
    radiusX: true,
    radiusY: true,
    rotationAngle: true,
    identifier: true
} as const
const touchListMap = {length: true, 0: touchMap} as const
const touchEventMap = {
    touches: touchListMap,
    targetTouches: touchListMap,
    changedTouches: touchListMap
} as const
export { touchEventMap };