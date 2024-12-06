import { expect } from 'vitest';
import { TransformationRepresentation } from '../src/api/transformation-representation';

type TransformationDimension = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

interface ValueComparisonResult{
    actualValue: number
    expectedValue: number
    dimension: TransformationDimension,
    pass: boolean
    difference: number
}

function valuesAreClose(dimension: TransformationDimension, actual: TransformationRepresentation, transformation: TransformationRepresentation): ValueComparisonResult{
    const actualValue = actual[dimension];
    const expectedValue = transformation[dimension];
    const difference = Math.abs(actualValue - expectedValue);
    return {
      pass: difference < .005,
      difference,
      dimension,
      actualValue,
      expectedValue
    }
  }

function toBeCloseToTransformation(received: TransformationRepresentation, expected: TransformationRepresentation){
    let violation: ValueComparisonResult;
    for(let dimension of ['a', 'b', 'c', 'd', 'e', 'f'] as TransformationDimension[]){
      const result = valuesAreClose(dimension, received, expected);
      if(!result.pass){
        violation = result;
        break;
      }
    }
    if(violation){
        return {
            pass: false,
            message: () => `expected ${violation.dimension} = ${violation.actualValue} to be close to ${violation.dimension} = ${violation.expectedValue}, but the difference was ${violation.difference} >= .005`
        }
    }
    return {
        pass: true,
        message: () => `did not expect transformations to be equal`
    };
}

function toMatchStringWithNumbersCloseTo(actual: string, numberMatcher: RegExp, ...expected: number[]){
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

expect.extend({
    toBeCloseToTransformation,
    toMatchStringWithNumbersCloseTo
})

