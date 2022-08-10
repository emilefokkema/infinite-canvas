import puppeteer from 'puppeteer';
import { TestPageImpl, TestPageFactory } from './test-page';
import { Config } from './config';

const factoryInstance: TestPageFactory<TransformTestPage> = {
    create(browser: puppeteer.Browser, page: puppeteer.Page, url?: string): TransformTestPage{
        return new TransformTestPage(browser, page, url);
    }
};

export class TransformTestPage extends TestPageImpl<TransformTestPage, Config>{
    protected factory: TestPageFactory<TransformTestPage> = factoryInstance;
    protected getBaseUrl(){return 'http://localhost:8080/transform-test';}

    public async initialize(): Promise<void>{
        await super.initialize();
        await this.page.evaluate(`initialize()`)
    }
    public static create(): Promise<TransformTestPage>{
        return this.createInternal(factoryInstance);
    }
}
