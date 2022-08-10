import puppeteer from 'puppeteer';
import path from 'path'
import fs from 'fs';

export class TestCasePage{
    private hasLoadedTestCase: boolean = false;
    constructor(
        private readonly browser: puppeteer.Browser,
        private readonly page: puppeteer.Page){
        
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
    public async loadTestCase(relativePath: string): Promise<void>{
        if(this.hasLoadedTestCase){
            await this.page.reload({waitUntil: 'domcontentloaded'});
        }
        const fullPath = path.resolve(process.cwd(), relativePath);
        const content = (await fs.readFileSync(fullPath, {encoding: 'utf8'})).replace(/[`\\\$]/g,'\\$&');
        const frame = this.page.frames()[0];
        const toEvaluate = `URL.createObjectURL(new Blob([\`${content}\`],{type: 'text/javascript'}))`;
        const objectURL = await frame.evaluate(toEvaluate);
        await frame.addScriptTag({content: `import testCase from '${objectURL}';loadTestCase(testCase)` , type: 'module'})
        await frame.waitForFunction('executeTestCase && executeTestCase()');
        this.hasLoadedTestCase = true;
    }
    public close(): Promise<void>{
        return this.browser.close();
    }
    public static async create(): Promise<TestCasePage> {
        const browser = await puppeteer.launch();
        const pages = await browser.pages();
        const page = pages[0];
        await page.goto('http://localhost:8080/test-case', {waitUntil: 'domcontentloaded'});
        return new TestCasePage(browser, page);
    }
}
