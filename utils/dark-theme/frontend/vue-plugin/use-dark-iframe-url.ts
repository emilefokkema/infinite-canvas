import { type Ref, ref, watchEffect, watch } from 'vue'
import type { DarkIFrameUrlOptions } from './dark-url-options';
import { DarkableUrl } from '../shared/darkable-url';
import { messages } from '../shared/messages';

export function useDarkIframeUrl({viteContentType, url, dark, iFrame}: DarkIFrameUrlOptions): Ref<string | undefined>{
    const initialValue = new DarkableUrl(url.value, viteContentType).addDarkToPath(dark.value).toString();
    const computedSrc = ref<string | undefined>(initialValue)
    watch(dark, (value) => {
        computedSrc.value = new DarkableUrl(computedSrc.value, viteContentType).addDarkToHash(value).toString();
    })
    watch(url, (value) => {
        computedSrc.value = new DarkableUrl(value, viteContentType).addDarkToPath(dark.value).toString();
    })
    watchEffect((onCleanup) => {
        const iFrameValue = iFrame.value;
        if(!iFrameValue){
            return;
        }
        const iFrameWindow = iFrameValue.contentWindow;
        if(!iFrameWindow){
            return;
        }
        const listener = messages.createMessageListener(iFrameWindow, 'dark-theme-url-changed', ({newUrl}) => {
            computedSrc.value = newUrl;
        })
        window.addEventListener('message', listener);
        onCleanup(() => {
            window.removeEventListener('message', listener)
        })
    })
    return computedSrc;
}