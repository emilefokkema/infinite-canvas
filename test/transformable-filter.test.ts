import {describe, it, expect, beforeEach } from '@jest/globals';
import { CanvasRectangle } from '../src/rectangle/canvas-rectangle';
import { CssLengthConverter } from "../src/css-length-converter";
import { TransformableFilter } from "../src/state/dimensions/transformable-filter";
import { Transformation } from '../src/transformation'
import './to-match-string-with-numbers-close-to'

function createMockRectangle(userTransformation: Transformation): CanvasRectangle{
    return {
        translateInfiniteCanvasContextTransformationToBitmapTransformation(infiniteCanvasContextTransformation: Transformation): Transformation{
            return userTransformation.inverse().before(infiniteCanvasContextTransformation).before(userTransformation);
        }
    } as CanvasRectangle;
}

describe('a transformable filter', () => {
    let cssLengthConverter: CssLengthConverter;

    beforeEach(() => {
        cssLengthConverter = {
            getNumberOfPixels(value: number): number{
                return value;
            }
        };
    });

    it.each([
        ['brightness(20%)',/brightness\(20%\)/, []],
        ['blur(2px)',/blur\((.*?)px\)/, [4]],
        ['blur(.2px)',/blur\((.*?)px\)/, [.4]],
        ['blur(0)',/blur\((.*?)px\)/, [0]],
        ['brightness(20%) blur(2px)',/brightness\(20%\) blur\((.*?)px\)/, [4]],
        ['drop-shadow(2px 2px 1px red)', /drop-shadow\((.*?)px (.*?)px (.*?)px red\)/, [4, -4, 2]],
        ['drop-shadow(2px 2px 0 red)', /drop-shadow\((.*?)px (.*?)px (.*?)px red\)/, [4, -4, 0]],
        ['drop-shadow(2px 2px 0 rgb(255, 0, 100))', /drop-shadow\((.*?)px (.*?)px (.*?)px rgb\(255, 0, 100\)\)/, [4, -4, 0]],
        ['drop-shadow(2px 2px 0)', /drop-shadow\((.*?)px (.*?)px (.*?)px\)/, [4, -4, 0]],
        ['drop-shadow(2px 2px 1px)', /drop-shadow\((.*?)px (.*?)px (.*?)px\)/, [4, -4, 2]],
        ['drop-shadow(2px 2px red)', /drop-shadow\((.*?)px (.*?)px red\)/, [4, -4]],
        ['drop-shadow(2px 2px)', /drop-shadow\((.*?)px (.*?)px\)/, [4, -4]],
        ['drop-shadow(2px 0)', /drop-shadow\((.*?)px (.*?)px\)/, [0, -4]],
        ['blur(2px) drop-shadow(2px 2px 1px red)', /blur\((.*?)px\) drop-shadow\((.*?)px (.*?)px (.*?)px red\)/, [4, 4, -4, 2]]
    ])('should transform \'%s\'', (initial: string, numberMatcher: RegExp, numbers: number[]) => {
        const transformation = new Transformation(0, -2, 2, 0, 1, 1);
        const mockRectangle = createMockRectangle(transformation)
        expect(TransformableFilter.create(initial, cssLengthConverter).toTransformedString(mockRectangle)).toMatchStringWithNumbersCloseTo(numberMatcher, ...numbers)
    })
})

describe('for a different unit', () => {
    let unit: string;
    let cssLengthConverter: CssLengthConverter;

    beforeEach(() => {
        unit = 'pt';
        cssLengthConverter = {
            getNumberOfPixels(value: number, units: string): number{
                if(units === unit){
                    return 2 * value;
                }
                return value;
            }
        };
    });

    it('should transform using number of pixels corresponding to unit', () => {
        const transformation = new Transformation(0, -2, 2, 0, 1, 1);
        const mockRectangle = createMockRectangle(transformation)
        expect(TransformableFilter.create(`drop-shadow(2${unit} 0)`, cssLengthConverter).toTransformedString(mockRectangle)).toMatchStringWithNumbersCloseTo(/drop-shadow\((.*?)px (.*?)px\)/, 0, -8)
    })
});

describe('filter', () => {
    let cssLengthConverter: CssLengthConverter;

    beforeEach(() => {
        cssLengthConverter = {
            getNumberOfPixels(value: number): number{
                return value;
            }
        };
    })

    it.each([
        'drop-shadow(5 3px)', // because '5' is not a valid length
        'drop-shadow(3px 3px red blue)' // two colors
    ])('should not be transformed', (filter: string) => {
        const transformation = new Transformation(2, 0, 0, 2, 1, 1);
        const mockRectangle = createMockRectangle(transformation)
        expect(TransformableFilter.create(filter, cssLengthConverter).toTransformedString(mockRectangle)).toEqual(filter);
    })
});