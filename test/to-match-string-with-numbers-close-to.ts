import {expect} from '@jest/globals';
import type {MatcherFunction, ExpectationResult} from 'expect';

const toMatchStringWithNumbersCloseTo: MatcherFunction<[RegExp, ...number[]]> = function(actual: string, numberMatcher: RegExp, ...expected: number[]){
    const match = numberMatcher.exec(actual);
    if(match === null){
        return {
            pass: false,
            message: () => `expected ${JSON.stringify(actual)} to match ${numberMatcher}`
        }
    }
    for(let i = 0; i < expected.length; i++){
        const matchString = match[i + 1];
        const matchNumber = Number(matchString)
        const expectedNumber = expected[i];
        if(isNaN(matchNumber) || Math.abs(matchNumber - expectedNumber) > .005){
            return {
                pass: false,
                message: () => `expected ${JSON.stringify(matchString)} to represent a number close to ${expectedNumber}`
            };
        }

    }
    return {
        pass: true,
        message: () => `did not expect ${JSON.stringify(actual)} to match ${numberMatcher} with numbers ${JSON.stringify(expected)}`
    };
}

expect.extend({ toMatchStringWithNumbersCloseTo })

declare module 'expect' {
    interface AsymmetricMatchers{
        toMatchStringWithNumbersCloseTo(numberMatcher: RegExp, ...expected: number[]): void
    }
    interface Matchers<R>{
        toMatchStringWithNumbersCloseTo(numberMatcher: RegExp, ...expected: number[]): R
    }
}