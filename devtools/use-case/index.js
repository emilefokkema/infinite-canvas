import getTextContent from "../../runtime-utils/get-text-content";
import getSearchParamsFromURLHash from "../../runtime-utils/get-search-params-from-url-hash";

async function appendScript(iframeDocument, body, scriptUrl){
    return new Promise((res) => {
        const script = iframeDocument.createElement('script');
        script.addEventListener('load', res);
        script.setAttribute('src', scriptUrl);
        body.appendChild(script);
    });
}
async function display(){
    const params = getSearchParamsFromURLHash();
    const id = params.get('id');
    const origin = new URL(location.href).origin;
    const manifestPath = new URL(`use-cases/${id}/manifest.json`, origin);
    const manifest = JSON.parse(await getTextContent(manifestPath));
    document.title = manifest.title;
    const pagePath = new URL(`use-cases/${id}/${manifest.page}`, origin);
    const iframe = document.getElementById('iframe');
    iframe.addEventListener('load', async () => {
        const iframeDocument = iframe.contentDocument;
        const head = iframeDocument.head;
        const body = iframeDocument.body;
        for(let styleFile of manifest.styles || []){
            const link = iframeDocument.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', styleFile);
            head.appendChild(link);
        }
        const scriptUrls = [new URL('infinite-canvas.js', origin).href].concat(manifest.scripts || []);
        for(let scriptUrl of scriptUrls){
            await appendScript(iframeDocument, body, scriptUrl);
        }
    });
    iframe.src = pagePath.href;
}

display();