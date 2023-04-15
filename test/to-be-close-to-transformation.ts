import {expect} from '@jest/globals';
import type {MatcherFunction} from 'expect';
import { TransformationRepresentation } from '../src/api-surface/transformation-representation';

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

const toBeCloseToTransformation: MatcherFunction<[transformation: TransformationRepresentation]> = function(actual: TransformationRepresentation, expected: TransformationRepresentation){
  let violation: ValueComparisonResult;
  for(let dimension of ['a', 'b', 'c', 'd', 'e', 'f'] as TransformationDimension[]){
    const result = valuesAreClose(dimension, actual, expected);
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

expect.extend({
    toBeCloseToTransformation
})

declare module 'expect' {
    interface AsymmetricMatchers {
      toBeCloseToTransformation(transformation: TransformationRepresentation): void;
    }
    interface Matchers<R> {
      toBeCloseToTransformation(transformation: TransformationRepresentation): R;
    }
  }