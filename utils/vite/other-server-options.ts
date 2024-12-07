import { HttpServer } from 'vite'

export interface OtherServerOptions{
    port: number
    server?: HttpServer
}