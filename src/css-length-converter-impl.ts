import { CssLengthConverter } from "./css-length-converter";

interface UnitMeasurement{
    numerator: number
    denominator: number
    pixels: number
}

function getNumberOfPixelsForDistance(ctx: CanvasRenderingContext2D, distance: string): number{
    let nonWhitePixelIndex: number = -1;
    const width = ctx.canvas.width;
    ctx.save();
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, 5);
    ctx.filter = `drop-shadow(${distance} 0)`;
    ctx.fillRect(0, 0, 1, 5);
    const imageData = ctx.getImageData(0, 0, width, 3)
    const array = imageData.data;
    for(let pixelIndex = 0; pixelIndex < width; pixelIndex++){
        const arrayIndex = 4 * (2 * width + pixelIndex);
        if(array[arrayIndex] !== 255){
          nonWhitePixelIndex = pixelIndex;
          break;
        }
      }
    ctx.restore();
    return nonWhitePixelIndex;
}

function createUnitMeasurement(ctx: CanvasRenderingContext2D, units: string): UnitMeasurement{
    const width = ctx.canvas.width;
    let numerator = 1;
    let denominator = 1;
    let pixels = -1;
    setPixels();
    zoomOutIfNecessary();
    zoomIn();
    return {numerator, denominator, pixels};
    function zoomIn(){
        let counter = 0;
        do{
            const oldPixels = pixels;
            zoomInStep();
            if(pixels === oldPixels){
                break;
            }
            counter++;
        }while(counter < 10)
    }
    function zoomInStep(){
        const outerRatio = width / (pixels + 1);
        let ratio = pixels === 0 ? outerRatio : Math.min((width - 1) / pixels, outerRatio);
        let flooredRatio;
        while((flooredRatio = Math.floor(ratio)) < 2){
            ratio *= 10;
            denominator *= 10;
        }
        numerator *= flooredRatio;
        setPixels();
        throwIfPixelsMinusOne();
    }
    function zoomOutIfNecessary(){
        let counter = 0;
        while(pixels === -1 && counter < 10){
            denominator *= 10;
            setPixels();
            counter++;
        }
        throwIfPixelsMinusOne();
    }
    function throwIfPixelsMinusOne(){
        if(pixels === -1){
            throw new Error(`something went wrong while getting measurement for unit '${units}' on canvas with width ${width}`)
        }
    }
    function setPixels(): void{
        pixels = getNumberOfPixelsForDistance(ctx, `${numerator / denominator}${units}`);
    }
}

export class CssLengthConverterImpl implements CssLengthConverter{
    private readonly cache: {[unit: string]: UnitMeasurement} = {};
    constructor(private readonly ctx: CanvasRenderingContext2D){

    }
    getNumberOfPixels(value: number, units: string): number {
        if(value === 0){
            return 0;
        }
        if(units === 'px'){
            return value;
        }
        let measurement = this.cache[units];
        if(!measurement){
            measurement = createUnitMeasurement(this.ctx, units);
            this.cache[units] = measurement;
        }
        
        const result = value * measurement.pixels * measurement.denominator / measurement.numerator;
        return result;
    }

}