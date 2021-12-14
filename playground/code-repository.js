import {
    decompressFromEncodedURIComponent,
    compressToEncodedURIComponent
} from 'lz-string'

class HashCodeRepository{
    getCode(){
        const hashSearchParams = this.getHashSearchParams();
        const compressedCode = hashSearchParams.get('code');
        return compressedCode ? decompressFromEncodedURIComponent(compressedCode) : null;
    }
    setCode(code){
        const compressedCode = compressToEncodedURIComponent(code);
        const hashSearchParams = this.getHashSearchParams();
        hashSearchParams.set('code', compressedCode);
        history.pushState(null, null, `#${hashSearchParams}`);
    }
    getHashSearchParams(){
        const url = new URL(window.location.href);
        return new URLSearchParams(url.hash.replace(/^#/,''));
    }
}
class LocalStorageCodeRepository{
    constructor(playgroundLocalStorage){
        this.playgroundLocalStorage = playgroundLocalStorage;
    }
    getCode(){
        return this.playgroundLocalStorage.getItem('code');
    }
    setCode(code){
        this.playgroundLocalStorage.setItem('code', code);
    }
}
export class CodeRepository{
    constructor(hashCodeRepository, localStorageCodeRepository, code, useLocalStorage){
        this.code = code;
        this.hashCodeRepository = hashCodeRepository;
        this.localStorageCodeRepository = localStorageCodeRepository;
        this.useLocalStorage = useLocalStorage;
    }
    getCode(){
        return this.code;
    }
    setCode(code){
        this.code = code;
        this.hashCodeRepository.setCode(code);
        if(this.useLocalStorage){
            this.localStorageCodeRepository.setCode(code);
        }
    }
    static create(playgroundLocalStorage){
        const hashCodeRepository = new HashCodeRepository();
        const localStorageCodeRepository = new LocalStorageCodeRepository(playgroundLocalStorage);
        const codeFromHash = hashCodeRepository.getCode();
        const codeFromLocalStorage = localStorageCodeRepository.getCode();
        const useLocalStorage = !codeFromHash;
        const code = codeFromHash || codeFromLocalStorage || `// the variable \`ctx\` is the\n// \`InfiniteCanvas\`'s \`CanvasRenderingContext2D\`\nctx.fillRect(20, 20, Infinity, 20);`;
        if(useLocalStorage && !codeFromLocalStorage){
            localStorageCodeRepository.setCode(code);
        }
        if(!codeFromHash){
            hashCodeRepository.setCode(code);
        }
        return new CodeRepository(hashCodeRepository, localStorageCodeRepository, code, useLocalStorage);
    }
}
