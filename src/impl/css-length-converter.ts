export interface CssLengthConverter{
    getNumberOfPixels(value: number, units: string): number;
}