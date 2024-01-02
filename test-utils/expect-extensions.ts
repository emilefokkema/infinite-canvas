import { expect } from 'vitest';
import { toMatchImageSnapshot as toMatchImageSnapshotOriginal, type MatchImageSnapshotOptions } from 'jest-image-snapshot'
import { TransformationRepresentation } from '../src/api-surface/transformation-representation';
import { getEnvironmentSuffix } from './get-environment-suffix'

type TransformationDimension = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

interface ValueComparisonResult{
    actualValue: number
    expectedValue: number
    dimension: TransformationDimension,
    pass: boolean
    difference: number
}

interface CustomImageSnapshotMatchOptions{
    identifier?: string
    dependsOnEnvironments?: string[]
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

function toMatchImageSnapshotCustom(received: any, options?: CustomImageSnapshotMatchOptions): { message(): string; pass: boolean }{
    const identifier = options?.identifier;
    const dependsOnEnvironments = options?.dependsOnEnvironments;
    const suffix = dependsOnEnvironments ? getEnvironmentSuffix(dependsOnEnvironments) : '';
    const originalOptions: MatchImageSnapshotOptions = {
        customDiffConfig: {threshold: 0.1},
        failureThresholdType: 'percent',
        failureThreshold: 0.005,
        customSnapshotIdentifier({ defaultIdentifier }){
            let result = defaultIdentifier;
            if(identifier !== undefined){
                result = identifier
            }
            return result + (suffix ? `-${suffix}` : '');
        }
    };
    return toMatchImageSnapshotOriginal.apply(this, [received, originalOptions]);
}

expect.extend({
    toBeCloseToTransformation,
    toMatchStringWithNumbersCloseTo,
    toMatchImageSnapshotCustom
})

interface CustomMatchers<R = unknown> {
    toBeCloseToTransformation(transformation: TransformationRepresentation): R
    toMatchStringWithNumbersCloseTo(numberMatcher: RegExp, ...expected: number[]): R
    toMatchImageSnapshotCustom(options?: CustomImageSnapshotMatchOptions): R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}