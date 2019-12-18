window.createImageBitmap = function(): Promise<ImageBitmap>{return undefined;};
(<any>window).ImageData = class {
    public width: number;
    public height: number;
    public data: Uint8ClampedArray;
    constructor(arrayOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number){
        if(typeof arrayOrWidth === "number"){
            this.width = arrayOrWidth;
            this.height = widthOrHeight;
        }else{
            this.width = widthOrHeight;
            this.height = height;
            this.data = arrayOrWidth;
        }
    }
};