import http from 'http'
import { default as express } from 'express'
import { catalogStaticRoot } from './constants'

export type Handler = (req: http.IncomingMessage, res: http.ServerResponse, next?: (err?: any) => void) => void
export interface IUsable {
    use(path: string, handler: Handler)
}
export function serveStaticContent(router: IUsable): void {
    router.use('/static', express.static(catalogStaticRoot))
}