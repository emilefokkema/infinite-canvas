import { PreventableDefault } from "./preventable-default";

export class InfiniteCanvasPreventableDefault implements PreventableDefault{
    private _defaultPrevented: boolean;
    public get defaultPrevented(): boolean{return this._defaultPrevented;}
    public get infiniteCanvasDefaultPrevented(): boolean{return this._defaultPrevented;}
    public get cancelable(): boolean{return true;}
    public preventDefault(): void{
        this._defaultPrevented = true;
    }
}