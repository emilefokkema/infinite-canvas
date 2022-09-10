import { TestPage } from './server/test-page';

const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

export async function compareToSnapshot(page: TestPage, identifier?: string){
    const options: any = {
        customDiffConfig: {threshold: 0.1},
        failureThresholdType: 'percent',
        failureThreshold: 0.005
    };
    if(identifier !== undefined){
        options.customSnapshotIdentifier = identifier;
    }
    (<any>expect(await page.getScreenshot())).toMatchImageSnapshot(options);
}
