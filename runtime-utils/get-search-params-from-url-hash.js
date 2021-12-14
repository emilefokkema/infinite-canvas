export default function getSearchParamsFromURLHash(){
    const location = new URL(window.location.href);
    return new URLSearchParams(location.hash.replace(/^#/,''));
}