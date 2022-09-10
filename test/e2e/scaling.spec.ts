import puppeteer from 'puppeteer';
import { ScalingTestPage } from './server/scaling-test-page';
import { compareToSnapshot } from './compare-to-snapshot';
import {TouchCollection, Touch} from "./server/touch-collection";
import { Units } from './server/config';

describe('when scaling', () => {
    let page: ScalingTestPage;

    beforeAll(async () => {
        page = await ScalingTestPage.create();
    });

    afterAll(async () => {
        await page.close();
    });

    it('should rotate correctly after resize', async () => {
        await page.resize(400, 600);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenDrawnAfter(() => mouse.move(120, 100));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should rotate-zoom correctly after resize', async () => {
        page = await page.recreate();
        await page.resize(400, 600);
        const touchCollection: TouchCollection = await page.getTouchCollection();
        const touch1: Touch = await touchCollection.start(100, 100);
        const touch2: Touch = await touchCollection.start(200, 100);
        await page.whenDrawnAfter(() => touch2.move(200, 200));
        await compareToSnapshot(page);
        await touch1.end();
        await touch2.end();
    });

    it('should respond to resize in case of css units', async () => {
        page = await page.recreate({units: Units.CSS});
        await page.whenDrawnAfter(() => page.resize(400, 600));
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenDrawnAfter(() => mouse.move(120, 100));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    })

    it('should behave in case of a different canvas scale', async () => {
        page = await page.recreate({width: 400, height: 400});
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenDrawnAfter(() => mouse.move(120, 100));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });

    it('should behave in case of a different canvas scale and css units', async () => {
        page = await page.recreate({width: 400, height: 400, units: Units.CSS});
        await compareToSnapshot(page);
        const mouse: puppeteer.Mouse = page.getMouse();
        await mouse.move(100, 100);
        await mouse.down({button: 'middle'});
        await page.whenDrawnAfter(() => mouse.move(120, 100));
        await compareToSnapshot(page);
        await mouse.up({button: 'middle'});
    });
});
