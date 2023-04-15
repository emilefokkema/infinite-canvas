import {describe, it, expect, beforeEach } from '@jest/globals';
import { CssLengthConverter } from "../src/css-length-converter";
import { TransformableFilter } from "../src/state/dimensions/transformable-filter";
import { Transformation } from '../src/transformation'

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
        ['brightness(20%)','brightness(20%)'],
        ['blur(2px)','blur(4px)'],
        ['blur(.2px)','blur(0.4px)'],
        ['blur(0)','blur(0px)'],
        ['brightness(20%) blur(2px)','brightness(20%) blur(4px)'],
        ['drop-shadow(2px 2px 1px red)', 'drop-shadow(4px -4px 2px red)'],
        ['drop-shadow(2px 2px 0 red)', 'drop-shadow(4px -4px 0px red)'],
        ['drop-shadow(2px 2px 0 rgb(255, 0, 100))', 'drop-shadow(4px -4px 0px rgb(255, 0, 100))'],
        ['drop-shadow(2px 2px 0)', 'drop-shadow(4px -4px 0px)'],
        ['drop-shadow(2px 2px 1px)', 'drop-shadow(4px -4px 2px)'],
        ['drop-shadow(2px 2px red)', 'drop-shadow(4px -4px red)'],
        ['drop-shadow(2px 2px)', 'drop-shadow(4px -4px)'],
        ['drop-shadow(2px 0)', 'drop-shadow(0px -4px)'],
        ['blur(2px) drop-shadow(2px 2px 1px red)', 'blur(4px) drop-shadow(4px -4px 2px red)']
    ])('should transform \'%s\'', (initial: string, expectedTransformed: string) => {
        const transformation = new Transformation(0, -2, 2, 0, 1, 1);
        expect(TransformableFilter.create(initial, cssLengthConverter).toTransformedString(transformation)).toEqual(expectedTransformed);
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
        expect(TransformableFilter.create(`drop-shadow(2${unit} 0)`, cssLengthConverter).toTransformedString(transformation)).toEqual(`drop-shadow(0px -8px)`)
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
        expect(TransformableFilter.create(filter, cssLengthConverter).toTransformedString(transformation)).toEqual(filter);
    })
});