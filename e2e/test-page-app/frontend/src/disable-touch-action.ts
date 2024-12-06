export function disableTouchAction(): void{
    const styleEl = document.createElement('style');
    styleEl.innerText = ':root{touch-action: none;}';
    document.head.appendChild(styleEl);
}