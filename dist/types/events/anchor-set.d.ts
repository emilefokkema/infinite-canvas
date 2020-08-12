import { Anchor } from "../transformer/anchor";
export declare class AnchorSet {
    private records;
    private latestIdentifier;
    constructor();
    addAnchor(anchor: Anchor, externalIdentifier?: any): number;
    getAnchorByIdentifier(identifier: number): Anchor;
    getAnchorByExternalIdentifier(externalIdentifier: any): Anchor;
    removeAnchorByIdentifier(identifier: number): void;
    removeAnchorByExternalIdentifier(externalIdentifier: any): void;
}
