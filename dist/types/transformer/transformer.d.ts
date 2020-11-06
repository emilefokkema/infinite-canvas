import { TransformerContext } from "./transformer-context";
import { Event } from "../custom-events/event";
export interface Transformer extends TransformerContext {
    readonly transformationStart: Event<void>;
    readonly transformationChange: Event<void>;
    readonly transformationEnd: Event<void>;
    zoom(x: number, y: number, scale: number): void;
    createAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void;
    createAnchor(x: number, y: number): number;
    createRotationAnchor(x: number, y: number): number;
    moveAnchorByExternalIdentifier(externalIdentifier: any, x: number, y: number): void;
    moveAnchorByIdentifier(identifier: number, x: number, y: number): void;
    releaseAnchorByExternalIdentifier(externalIdentifier: any): void;
    releaseAnchorByIdentifier(identifier: number): void;
}
