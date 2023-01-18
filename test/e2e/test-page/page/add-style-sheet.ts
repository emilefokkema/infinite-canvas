export function addStyleSheet(cssText: string): void{
    const el = document.createElement('style');
    document.head.appendChild(el);
    el.innerHTML = cssText;
}