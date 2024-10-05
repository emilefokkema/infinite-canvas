import crypto from 'crypto'
import { connect, type Page, type Browser, type JSHandle, type EvaluateFuncWith } from 'puppeteer'
import fetch from 'node-fetch'
import {default as WebSocket, type MessageEvent} from 'ws'
import { type EventTarget, type AttachedEventListener, EVENT_LISTENER_DATA } from 'test-page-lib'
import { openTestingMessagePort } from '../testing-message-ports/open-testing-message-port';
import { getNext, ensureNoNext, fromSource } from './next';

export type EventListenerAdder = <
    TEventType,
    TEventTarget extends EventTarget<TEventType, TEventName>,
    TEventName,
    >(target: JSHandle<TEventTarget>, eventName: TEventName, capture?: boolean) => Promise<InPageEventListener<TEventType>>

interface PageUtils{
    page: Page
    cleanup(): Promise<void>
    addEventListenerInPage: EventListenerAdder
}

class EventDispatcher<T extends unknown[]>{
    private listeners: ((...args: T) => void)[] = [];
    public addListener(listener: (...args: T) => void): void{
        this.listeners.push(listener)
    }
    public removeListener(listener: (...args: T) => void){
        const index = this.listeners.indexOf(listener);
        if(index === -1){
            return;
        }
        this.listeners.splice(index, 1);
    }
    public dispatch(...args: T): void{
        for(let listener of this.listeners.slice()){
            listener(...args)
        }
    }
}

export interface InPageEventListener<TEventType>{
    addListener(listener: (e: TEventType) => void): void
    removeListener(listener: (e: TEventType) => void): void
    getNext(): Promise<TEventType>
    ensureNoNext(interval: number): Promise<void>
    modify(fn: EvaluateFuncWith<AttachedEventListener<TEventType>,[]>): Promise<unknown>
    remove(): Promise<void>
}

class InPageEventListenerImpl<TEventType> implements InPageEventListener<TEventType>{
    private dispatcher: EventDispatcher<[TEventType]> = new EventDispatcher();
    private messageListener: (e: MessageEvent) => void;
    constructor(
        private readonly messagePort: WebSocket,
        private readonly attachedEventListener: JSHandle<AttachedEventListener<TEventType>>,
        private readonly listenerId: string){
            this.messageListener = this.onMessage.bind(this);
            messagePort.addEventListener('message', this.messageListener)
    }
    public addListener(listener: (e: TEventType) => void): void{
        this.dispatcher.addListener(listener);
    }
    public removeListener(listener: (e: TEventType) => void): void{
        this.dispatcher.removeListener(listener);
    }
    public modify(fn: EvaluateFuncWith<AttachedEventListener<TEventType>,[]>): Promise<unknown>{
        return this.attachedEventListener.evaluate(fn)
    }
    public ensureNoNext(interval: number): Promise<void>{
        return ensureNoNext(fromSource(this), interval);
    }
    public getNext(): Promise<TEventType>{
        return getNext(this);
    }
    public async remove(): Promise<void>{
        await this.attachedEventListener.evaluate(l => l.remove());
        this.messagePort.removeListener('message', this.messageListener)
    }
    private onMessage(e: MessageEvent): void{
        const data = e.data;
        if(typeof data !== 'string'){
            return;
        }
        const parsed = JSON.parse(data);
        if(parsed.type !== EVENT_LISTENER_DATA || parsed.id !== this.listenerId){
            return;
        }
        this.dispatcher.dispatch(parsed.data);
    }
}

export async function setSize(page: Page, width: number, height: number): Promise<void>{
    await page.setViewport({width, height, deviceScaleFactor: 1, hasTouch: true});
}

export async function launchBrowser(): Promise<{browser: Browser, cleanup: () => Promise<void>}>{
    const res = await fetch('http://127.0.0.1:8080/test-browser/')
    const browserWSEndpoint = await res.text();
    const result = await connect({browserWSEndpoint})
    return {
        browser: result,
        async cleanup(){
            result.disconnect();
            const postResult = await fetch('http://127.0.0.1:8080/test-browser/', {
                method: 'POST',
                body: browserWSEndpoint,
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
            if(postResult.status !== 200){
                throw new Error('failed to clean up browser!')
            }
        }
    };
}

export async function getPageInBrowser(browser: Browser, path?: string): Promise<PageUtils>{
    const messagePortUrl = `ws://127.0.0.1:8080/testing-message-port/${crypto.randomUUID()}`
    let messagePort: WebSocket;
    const page = await browser.newPage();
    await page.goto('http://localhost:8080' + (path || ''), {waitUntil: 'domcontentloaded'})
    await setSize(page, 600, 600);
    return {
        page, 
        async cleanup(){
            await page.close();
        },
        addEventListenerInPage
    }

    async function openMessagePort(): Promise<void>{
        [messagePort] = await Promise.all([
            openTestingMessagePort(() => new WebSocket(messagePortUrl)),
            page.evaluate((url) => window.TestPageLib.openMessagePort(url), messagePortUrl)
        ])
    }

    async function addEventListenerInPage
        <
        TEventType,
        TEventTarget extends EventTarget<TEventType, TEventName>,
        TEventName,
        >(target: JSHandle<TEventTarget>, eventName: TEventName, capture: boolean | undefined): Promise<InPageEventListener<TEventType>>{
            const listenerId = crypto.randomUUID();
            if(!messagePort){
                await openMessagePort();
            }
            const attachedListener = await page.evaluateHandle(
                (target, eventName, capture, listenerId) => window.TestPageLib.addEventListener<TEventName, TEventType, TEventTarget>(
                    target,
                    eventName as TEventName,
                    capture,
                    listenerId),
                target,
                eventName,
                capture,
                listenerId);
            return new InPageEventListenerImpl(messagePort, attachedListener, listenerId);
    }
}

export async function getPage(path?: string): Promise<PageUtils>{
    const {browser, cleanup: cleanupBrowser} = await launchBrowser();
    const {cleanup, ...rest} = await getPageInBrowser(browser, path);
    return {
        ...rest,
        async cleanup(){
            await cleanup();
            await cleanupBrowser();
        }
    }
}