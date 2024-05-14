import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import type { Page, Browser } from 'puppeteer'
import testCases from 'virtual:test-cases-3'
import { getPageInBrowser, getScreenshot, launchBrowser } from './utils'
import '../test-utils/expect-extensions'

describe('the test cases', () => {
    let page: Page;
    let browser: Browser;
    let cleanupBrowser: () => Promise<void>;
    let cleanup: () => Promise<void>;

    beforeAll(async () => {
        ({browser, cleanup: cleanupBrowser} = await launchBrowser());
        ({page, cleanup} = await getPageInBrowser(browser, '/test-case/'));
    })

    describe.each(testCases)('$title', ({id, dependsOnEnvironments, skip}) => {
        it.skipIf(skip)('', async () => {
            await page.evaluate((id) => window.TestCaseLib.drawTestCase(id), id)
            expect(await getScreenshot(page)).toMatchImageSnapshotCustom({identifier: id.replace(/\.mjs$/,''), dependsOnEnvironments})
        })
    })

    afterAll(async () => {
        await cleanup();
        await cleanupBrowser();
    })
})