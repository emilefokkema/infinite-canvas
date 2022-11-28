import {TestCasePage} from './server/test-case-page';
import path from 'path';
import fs from 'fs';
const { toMatchImageSnapshot } = require('jest-image-snapshot');

declare const __TEST_CASE_MOD__: number;
declare var __SNAPSHOT_SUFFIX__: string;

expect.extend({ toMatchImageSnapshot });
const testCaseFiles = fs.readdirSync(path.resolve(__dirname, `../test-cases`)).map(fileName => fileName.replace(/\.js$/,'')).filter((_, i) => i % 3 === __TEST_CASE_MOD__);

describe('test case', () => {
    let testPage: TestCasePage;

    beforeAll(async () => {
        testPage = await TestCasePage.create();
    });

    afterAll(async () => {
        await testPage.close();
    });

    it.each(testCaseFiles)('%s', async (file) => {
        await testPage.loadTestCase(`./test/test-cases/${file}.js`);
        (<any>expect(await testPage.getScreenshot())).toMatchImageSnapshot({
            customDiffConfig: {threshold: 0.1},
            customSnapshotIdentifier: `${file}-${__SNAPSHOT_SUFFIX__}`,
            failureThresholdType: 'percent',
            failureThreshold: 0.005
        });
    });
});
