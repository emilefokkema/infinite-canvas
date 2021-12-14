export default function getTextContent(url){
    return new Promise((res, rej) => {
        const request = new XMLHttpRequest();
        request.addEventListener('load', () => res(request.response));
        request.addEventListener('error', () => rej());
        request.addEventListener('abort', () => rej());
        request.addEventListener('timeout', () => rej());
        request.open('GET', url);
        request.send();
    });
}