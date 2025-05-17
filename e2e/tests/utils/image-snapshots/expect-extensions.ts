import { expect } from 'vitest'
import { toMatchImageSnapshot as toMatchImageSnapshotOriginal, type MatchImageSnapshotOptions } from 'jest-image-snapshot'
import { ImageSnapshotMatchOptions } from './image-snapshot-match-options'
import { fileURLToPath } from 'url';

const customSnapshotsDir = fileURLToPath(new URL(`../../__image_snapshots__/${process.env.SNAPSHOT_ENVIRONMENT}`, import.meta.url))

expect.extend({
    toMatchImageSnapshotCustom(received: any, options?: ImageSnapshotMatchOptions){
        const identifier = options?.identifier;
        const originalOptions: MatchImageSnapshotOptions = {
            customDiffConfig: {threshold: 0.1},
            failureThresholdType: 'percent',
            failureThreshold: 0.005,
            customSnapshotsDir,
            customSnapshotIdentifier({ defaultIdentifier }){
                return identifier || defaultIdentifier;
            }
        };
        return toMatchImageSnapshotOriginal.apply(this, [received, originalOptions]);
    }
})