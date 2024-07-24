import { getMessages } from '../../../window-messages'

export interface DarkThemeUrlChanged{
    newUrl: string
}

export interface TypeMap{
    'dark-theme-url-changed': DarkThemeUrlChanged
}

export const messages = getMessages<TypeMap>()