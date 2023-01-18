import {launch, Browser, Page, Mouse, Keyboard, CDPSession, ConsoleMessage } from 'puppeteer';
import { evaluateOnPage } from './utils';
import { TouchCollection } from './touch-collection';
import { WindowEventMap } from './shared/window-event-map';
import { EventListenerConfiguration, FullInfiniteCanvasE2EInitialization, CanvasElementInitialization } from './shared/configuration';
import { TestPageLib as TestPageLibInterface } from './page/interfaces'
import { EventListenerProxy, InfiniteCanvasProxy, EventListenerProvider, CanvasElementProxy } from './proxies';
import { EventListenerProxyImpl } from './event-listener-proxy-impl';
import { InfiniteCanvasProxyImpl } from './infinite-canvas-proxy-impl';
import { CanvasElementProxyImpl } from './canvas-element-proxy-impl';

declare const TestPageLib: TestPageLibInterface;

function setViewport(page: Page, width: number, height: number): Promise<void>{
    return page.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
        hasTouch: true
    });
}

export class TestPage implements EventListenerProvider<WindowEventMap>{
    private static url: string = 'http://localhost:8080/test-page';
    constructor(
        private readonly browser: Browser,
        private readonly page: Page
    ){

    }
    public async addEventListener<Type extends keyof WindowEventMap>(config: EventListenerConfiguration<WindowEventMap, Type>): Promise<EventListenerProxy<WindowEventMap[Type]>>{
        const handle = await evaluateOnPage(this.page, (config) => TestPageLib.addWindowEventListener(config), config);
        return new EventListenerProxyImpl(handle);
    }
    public async getTouchCollection(): Promise<TouchCollection>{
        const session: CDPSession = await this.page.target().createCDPSession();
        return new TouchCollection(session);
    }
    public setDragInterception(enabled: boolean): Promise<void>{
        return (<any>this.page).setDragInterception(enabled);
    }
    public getMouse(): Mouse {
        return this.page.mouse;
    }
    public getKeyboard(): Keyboard {
        return this.page.keyboard;
    }
    public async getScrollY(): Promise<number>{
        return <number>(await this.page.frames()[0].evaluate('scrollY'));
    }
    public getScreenshot(): Promise<string | Buffer>{
        return this.page.screenshot({
            clip: {
                x: 0,
                y: 0,
                width: 400,
                height: 400
            }
        })
    }
    public resize(width: number, height: number): Promise<void>{
        return setViewport(this.page, width, height);
    }
    public async initializeInfiniteCanvas(initialization: FullInfiniteCanvasE2EInitialization): Promise<InfiniteCanvasProxy>{
        const handleOnTestPage = await evaluateOnPage(this.page, (initialization) => TestPageLib.initializeInfiniteCanvas(initialization), initialization);
        return new InfiniteCanvasProxyImpl(handleOnTestPage);
    }
    public async addStyleSheet(cssText: string): Promise<void>{
        await evaluateOnPage(this.page, (cssText) => TestPageLib.addStyleSheet(cssText), cssText);
    }
    public waitForConsoleMessage(predicate: (message: ConsoleMessage) => boolean): Promise<void>{
        return new Promise((res) => {
            this.page.on('console', (m) => {
                if(predicate(m)){
                    res();
                }
            })
        })
    }
    public async initializeCanvasElement(initialization: CanvasElementInitialization): Promise<CanvasElementProxy>{
        const handleOnTestPage = await evaluateOnPage(this.page, (initialization) => TestPageLib.initializeCanvas(initialization), initialization);
        return new CanvasElementProxyImpl(handleOnTestPage);
    }
    public close(): Promise<void>{
        return this.browser.close();
    }

    public async recreate(): Promise<TestPage>{
        const newPage = await this.browser.newPage();
        await this.page.close();
        await setViewport(newPage, 600, 600);
        await newPage.goto(TestPage.url, {waitUntil: 'domcontentloaded'});
        return new TestPage(this.browser, newPage);
    }

    public static async create(): Promise<TestPage>{
        const browser = await launch();
        const pages = await browser.pages();
        const page = pages[0];
        await setViewport(page, 600, 600);
        await page.goto(this.url, {waitUntil: 'domcontentloaded'});
        return new TestPage(browser, page);
    }
}
