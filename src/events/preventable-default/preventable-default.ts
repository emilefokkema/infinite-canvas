export interface PreventableDefault{
    readonly defaultPrevented: boolean;
    readonly cancelable: boolean;
    readonly infiniteCanvasDefaultPrevented: boolean;
    preventDefault(): void;
}