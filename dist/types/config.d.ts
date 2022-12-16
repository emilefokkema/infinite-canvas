import { Units } from "./units";
/**
 * This interface contains properties that determine the behavior of the {@link InfiniteCanvas}.
 */
export interface Config {
    /**
     * Determines whether rotating the {@link InfiniteCanvas} is possible or not
     *
     * @defaultValue true
     */
    rotationEnabled: boolean;
    /**
     * If `true`, this means that the {@link InfiniteCanvas} will pan when touched with one finger, and that it will zoom when the user scrolls without pressing the Ctrl key
     *
     * @defaultValue false
     */
    greedyGestureHandling: boolean;
    /**
     * Determines the units to use when drawing on an {@link InfiniteCanvas}
     *
     * @defaultValue {@link Units.CANVAS}
     */
    units: Units;
}
