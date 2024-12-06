import { describe, it, expect, beforeAll } from 'vitest'
import { SERVER_BASE_URL } from '../shared/constants'
import testCases from 'virtual:test-cases-metadata-3-2'

describe('the test cases', () => {

    beforeAll(async () => {
        await page.page.goto(new URL('test-case/', SERVER_BASE_URL).toString(), {waitUntil: 'domcontentloaded'})
    })

    describe.each(testCases)('$title', ({id, dependsOnEnvironments, skip}) => {
        it.skipIf(skip)('', async () => {
            await page.page.evaluate((id) => window.TestCasesLib.drawTestCase(id), id);
            expect(await page.getScreenshot()).toMatchImageSnapshotCustom({
                identifier: id,
                dependsOnEnvironment: !!dependsOnEnvironments || undefined
            })
        })
    })
})