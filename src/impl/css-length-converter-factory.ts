import { CssLengthConverter } from "./css-length-converter";

export interface CssLengthConverterFactory{
    create(): CssLengthConverter
}