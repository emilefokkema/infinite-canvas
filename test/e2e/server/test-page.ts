import puppeteer from 'puppeteer';
import { Config, ConfigImpl } from './config';
import {TouchCollection} from "./touch-collection";

export interface TestPage{
    initialize(): Promise<void>;
    getScreenshot(): Promise<string | Buffer>;
}

export interface TestPageFactory<TTestPage extends TestPage>{
    create(browser: puppeteer.Browser, page: puppeteer.Page, url?: string): TTestPage;
}

export abstract class TestPageImpl<
    TConcrete extends TestPage,
    TConfig extends Config>{
    protected abstract readonly factory: TestPageFactory<TConcrete>;
    constructor(
        protected readonly browser: puppeteer.Browser,
        protected readonly page: puppeteer.Page,
        protected readonly url: string){
            if(!url){
                this.url = this.getBaseUrl();
            }

    }
    protected abstract getBaseUrl(): string;

    public async initialize(): Promise<void>{
        await this.page.setViewport({
            width: 600,
            height: 600,
            deviceScaleFactor: 1,
            hasTouch: true
        });
        await this.page.goto(this.url, {waitUntil: 'domcontentloaded'});
    }

    public async resize(width: number, height: number): Promise<void>{
        await this.page.setViewport({
            width,
            height,
            deviceScaleFactor: 1,
            hasTouch: true
        });
    }

    public async getTouchCollection(): Promise<TouchCollection>{
        const session: puppeteer.CDPSession = await this.page.target().createCDPSession();
        return new TouchCollection(session);
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
    public async getScrollY(): Promise<number>{
        return <number>(await this.page.frames()[0].evaluate('scrollY'));
    }

    public getMouse(): puppeteer.Mouse {
        return this.page.mouse;
    }
    public getKeyboard(): puppeteer.Keyboard {
        return this.page.keyboard;
    }
    public close(): Promise<void>{
        return this.browser.close();
    }
    public whenDrawnAfter(fn: () => Promise<void>): Promise<void>{
        return this.getResultAfter(`testCanvas.waitForDrawing()`, fn);
    }
    public whenDebouncedScrolledAfter(fn: () => Promise<void>, interval: number): Promise<void>{
        return this.getResultAfter(`waitForNextDebouncedScrollEvent(${interval})`, fn);
    }
    public whenDebouncedDrawnAfter(fn: () => Promise<void>, interval: number): Promise<void>{
        return this.getResultAfter(`testCanvas.waitForDebouncedDrawing(${interval})`, fn);
    }
    public whenNotDrawnAfter(fn: () => Promise<void>, interval: number): Promise<void>{
        return this.getResultAfter(`testCanvas.whenNotDrawnFor(${interval})`, fn);
    }
    private async getResultAfter<T>(expression: string, fn: () => Promise<void>): Promise<T>{
        const p = await this.page.evaluateHandle(expression);
        await fn();
        return <T>(await p.evaluate(h => h.promise));
    }
    protected modifySearchParams(params: URLSearchParams, config: Partial<TConfig>): void{

    }

    public async recreate(config?: Partial<TConfig>): Promise<TConcrete>{
        const newConfig = ConfigImpl.default.change(config);
        const searchParams: URLSearchParams = newConfig.getSearchParams();
        this.modifySearchParams(searchParams, config);
        const newUrl = `${this.getBaseUrl()}?${searchParams}`;
        const newPage = await this.browser.newPage();
        await this.page.close();
        const result = this.factory.create(this.browser, newPage, newUrl);
        await result.initialize();
        return result;
    }

    protected static async createInternal<TTestPage extends TestPage>(factory: TestPageFactory<TTestPage>): Promise<TTestPage>{
        const browser = await puppeteer.launch();
        const pages = await browser.pages();
        const page = pages[0];
        const result = factory.create(browser, page);
        await result.initialize();
        return result;
    }
}
