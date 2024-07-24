import { type Ref, computed } from 'vue'
import { DarkableUrl } from '../shared/darkable-url';
import type { DarkUrlOptions } from './dark-url-options';

export function useDarkenedUrl({viteContentType, url, dark}: DarkUrlOptions): Ref<string>{
    return computed(() => {
        return new DarkableUrl(url.value, viteContentType).addDarkToPath(dark.value).toString();
    })
}