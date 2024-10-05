import http from 'http'

export interface OtherServerOptions{
    port: number
    server?: http.Server
}