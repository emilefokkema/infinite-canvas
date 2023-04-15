import {expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import {TestCasePage} from './server/test-case-page';
import testCasesToRun from './test-cases-to-run';
const { toMatchImageSnapshot } = require('jest-image-snapshot');

declare const __TEST_CASE_MOD__: number;
declare var __SNAPSHOT_SUFFIX__: string;

expect.extend({ toMatchImageSnapshot });
const testCaseFiles: [string, string, boolean][] = testCasesToRun.filter((_, i) => i % 3 === __TEST_CASE_MOD__).map(({fullPath, id}) => [fullPath, id, false]);
if(testCaseFiles.length === 0){
    testCaseFiles.push([null, null, true])
}

describe('test case', () => {
    let testPage: TestCasePage;

    beforeAll(async () => {
        testPage = await TestCasePage.create();
    });

    afterAll(async () => {
        await testPage.close();
    });

    it.each(testCaseFiles)('%s', async (fullPath, id, shouldBeSkipped) => {
        if(shouldBeSkipped){
            return;
        }
        await testPage.loadTestCase(fullPath);
        (<any>expect(await testPage.getScreenshot())).toMatchImageSnapshot({
            customDiffConfig: {threshold: 0.1},
            customSnapshotIdentifier: `${id}-${__SNAPSHOT_SUFFIX__}`,
            failureThresholdType: 'percent',
            failureThreshold: 0.005
        });
    });
});
