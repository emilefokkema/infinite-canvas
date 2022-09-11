import { TestPage } from './server/test-page';

const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });
declare var __SNAPSHOT_SUFFIX__: string;

export async function compareToSnapshot(page: TestPage, identifier?: string){
    const options: any = {
        customDiffConfig: {threshold: 0.1},
        failureThresholdType: 'percent',
        failureThreshold: 0.005,
        customSnapshotIdentifier(obj: {defaultIdentifier: string}){
            if(identifier !== undefined){
                return `${identifier}-${__SNAPSHOT_SUFFIX__}`;
            }
            return `${obj.defaultIdentifier}-${__SNAPSHOT_SUFFIX__}`
        }
    };
    (<any>expect(await page.getScreenshot())).toMatchImageSnapshot(options);
}
