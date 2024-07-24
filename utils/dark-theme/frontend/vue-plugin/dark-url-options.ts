import type { Ref } from 'vue'
import type { ViteContentType } from '../shared/vite-content-type'

export interface DarkUrlOptions{
    viteContentType: ViteContentType
    url: Ref<string | undefined>
    dark: Ref<boolean>
}

export interface DarkIFrameUrlOptions extends DarkUrlOptions{
    iFrame: Ref<HTMLIFrameElement | null>
}