import 'vitest'
import { ImageSnapshotMatchOptions } from './image-snapshot-match-options'

interface CustomMatchers<R = unknown> {
    toMatchImageSnapshotCustom(options?: ImageSnapshotMatchOptions): R
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}