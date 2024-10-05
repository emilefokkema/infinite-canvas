import { OtherOptions } from './other-options'
import { OtherServerOptions } from './other-server-options'

export interface ServeOtherOptions extends OtherOptions{
    server: OtherServerOptions
}