import puppeteer from 'puppeteer';
import { TestPageImpl, TestPageFactory } from './test-page';
import { Config } from './config';

const factoryInstance: TestPageFactory<ScalingTestPage> = {
    create(browser: puppeteer.Browser, page: puppeteer.Page, url?: string): ScalingTestPage{
        return new ScalingTestPage(browser, page, url);
    }
};

export interface ScalingTestPageConfig extends Config{
    width: number;
    height: number;
}

export class ScalingTestPage extends TestPageImpl<ScalingTestPage, ScalingTestPageConfig>{
    protected getBaseUrl(){return 'http://localhost:8080/scaling-test';}
    protected readonly factory = factoryInstance;

    protected modifySearchParams(params: URLSearchParams, config: Partial<ScalingTestPageConfig>){
        if(!config){
            return;
        }
        if(config.width !== undefined){
            params.set('width', config.width.toString());
        }
        if(config.height !== undefined){
            params.set('height', config.height.toString());
        }
    }

    public async initialize(): Promise<void>{
        await super.initialize();
        await this.page.evaluate(`initialize()`)
    }

    public static create(): Promise<ScalingTestPage>{
        return this.createInternal(factoryInstance);
    }
}