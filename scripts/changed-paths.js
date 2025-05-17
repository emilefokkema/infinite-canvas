import { fileURLToPath } from 'url'

export function *getChangedPaths(shortGitStatusOutput){
    const statusEntryRegEx = /[\sM?]{2}\s([^\r\n]*)[\r\n]+/g;
    let match;
    while((match = statusEntryRegEx.exec(shortGitStatusOutput)) !== null){
        yield fileURLToPath(new URL(`../${match[1]}`, import.meta.url));
    }
}