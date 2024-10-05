import { DARK_THEME_STYLE_ID, DARK_THEME_CSS_CONTENT_ID } from '../../shared/constants'
import { DarkableUrl } from './darkable-url';
import { messages } from './messages';
import type { ViteContentType } from './vite-content-type';

function createDarkThemeStyleElement(darkThemeCssContent: HTMLScriptElement | null): HTMLStyleElement | null{
    if(!darkThemeCssContent){
        return null;
    }
    const content = darkThemeCssContent.textContent;
    const result = document.createElement('style');
    result.textContent = content;
    return result;
}
function initialize(): void{
    const darkThemeCssContentScript = document.getElementById(DARK_THEME_CSS_CONTENT_ID) as HTMLScriptElement | null
    const darkThemeStyle = document.getElementById(DARK_THEME_STYLE_ID) || createDarkThemeStyleElement(darkThemeCssContentScript)
    if(!darkThemeStyle){
        return;
    }
    const viteContentType: ViteContentType = import.meta.env.MODE === 'development' ? 'served' : 'built';

    window.addEventListener('hashchange', () => {
        const darkableUrl = new DarkableUrl(window.location.href, viteContentType)
        if(!darkableUrl.hasChange()){
            return;
        }
        const currentlyDark = isDark();
        if(currentlyDark){
            darkThemeStyle.remove();
        }else{
            const firstInBody = document.body.firstChild;
            if(firstInBody){
                document.body.insertBefore(darkThemeStyle, firstInBody)
            }else{
                document.body.appendChild(darkThemeStyle)
            }
        }
        darkableUrl.removeChange();
        darkableUrl.addDarkToPath(!currentlyDark)
        const newUrl = darkableUrl.toString();
        window.history.replaceState({}, '', newUrl)
        messages.sendToParent('dark-theme-url-changed', {newUrl})
    })
    function isDark(): boolean{
        return darkThemeStyle?.isConnected || false;
    }
}

initialize();
