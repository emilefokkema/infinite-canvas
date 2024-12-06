import { expect } from 'vitest'
import { toMatchImageSnapshot as toMatchImageSnapshotOriginal, type MatchImageSnapshotOptions } from 'jest-image-snapshot'
import { ImageSnapshotMatchOptions } from './image-snapshot-match-options'
import { getCurrentEnvironment } from '../environments';

function getImageSnapshotIdentifierSuffix(options: ImageSnapshotMatchOptions | undefined): string{
    if(!options || !options.dependsOnEnvironment){
        return '';
    }
    const current = getCurrentEnvironment();
    return `-${current.id}`
}
expect.extend({
    toMatchImageSnapshotCustom(received: any, options?: ImageSnapshotMatchOptions){
        const identifier = options?.identifier;
        const suffix = getImageSnapshotIdentifierSuffix(options);
        const originalOptions: MatchImageSnapshotOptions = {
            customDiffConfig: {threshold: 0.1},
            failureThresholdType: 'percent',
            failureThreshold: 0.005,
            customSnapshotIdentifier({ defaultIdentifier }){
                return ( identifier || defaultIdentifier ) + suffix;
            }
        };
        return toMatchImageSnapshotOriginal.apply(this, [received, originalOptions]);
    }
})