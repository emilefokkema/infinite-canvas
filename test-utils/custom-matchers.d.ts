import { TransformationRepresentation } from '../src/api/transformation-representation'

interface CustomMatchers<R = unknown> {
    toBeCloseToTransformation(transformation: TransformationRepresentation): R
    toMatchStringWithNumbersCloseTo(numberMatcher: RegExp, ...expected: number[]): R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}