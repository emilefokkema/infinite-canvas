import { TestPage } from './server/test-page';

const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

export async function compareToSnapshot(page: TestPage){
    (<any>expect(await page.getScreenshot())).toMatchImageSnapshot({
        customDiffConfig: {threshold: 0.1},
        failureThresholdType: 'percent',
        failureThreshold: 0.005
    });
}
