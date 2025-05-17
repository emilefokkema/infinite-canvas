import { PreventableDefault } from "./preventable-default";

export class NormalPreventableDefault implements PreventableDefault{
    public get infiniteCanvasDefaultPrevented(): boolean{return false;}
    public get defaultPrevented(): boolean{return false;}
    public get cancelable(): boolean{return false;}
    public preventDefault(): void{}
}