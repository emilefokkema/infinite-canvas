/**
 * This represents an a DOM event to which {@link InfiniteCanvas} attaches a default behavior.
 *
 * @example
 * ```js
 * infCanvas.addEventListener('mousedown', e => {
 *     console.log(e.nativeDefaultPrevented)
 *     // --> `false`
 *
 *     // keep the InfiniteCanvas from panning
 *     e.preventDefault(true);
 *
 *     console.log(e.nativeDefaultPrevented);
 *     // --> `true`, because the original mouse event's default was also prevented
 * });
 * ```
 */
export interface InfiniteCanvasEventWithDefaultBehavior {
    /**
     * Returns whether the default for the original DOM event was prevented
     */
    readonly nativeDefaultPrevented: boolean;
    /**
     * Returns whether the default for the original DOM event is cancelable
     */
    readonly nativeCancelable: boolean;
    /**
     * Prevents {@link InfiniteCanvas}'s default behavior from occuring
     * @param preventNativeDefault whether or not to also prevent the default behavior of the 'native' event
     */
    preventDefault(preventNativeDefault?: boolean): void;
}
