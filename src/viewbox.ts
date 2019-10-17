import { Transformable } from "./transformable";
import { WithState } from "./state/with-state";
import { PathContainer } from "./path-container";

export interface ViewBox extends Transformable, WithState, PathContainer{
    width: number;
    height: number;
}