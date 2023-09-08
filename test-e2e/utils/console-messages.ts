import type { Page, ConsoleMessage } from 'puppeteer'
import { fromEvent, firstValueFrom, filter } from 'rxjs'
import { ensureNoNext } from './next'

export async function waitForConsoleMessage(page: Page, predicate: (msg: ConsoleMessage) => boolean): Promise<ConsoleMessage>{
    return await firstValueFrom(fromEvent(page, 'console').pipe(filter(predicate)))
}

export function ensureNoConsoleMessage(page: Page, predicate: (msg: ConsoleMessage) => boolean, interval: number): Promise<void>{
    return ensureNoNext(fromEvent(page, 'console').pipe(filter(predicate)), interval)
}