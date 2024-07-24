import { UrlLikeHash } from "../../../frontend/url-like-hash";
import type { ViteContentType } from "./vite-content-type";

export class DarkableUrl{
    private readonly url: URL | undefined;
    private readonly urlLikeHash: UrlLikeHash | undefined
    public constructor(url: string | undefined, private readonly viteContentType: ViteContentType){
        this.url = url ? new URL(url) : undefined;
        this.urlLikeHash = this.url ? UrlLikeHash.tryCreate(this.url.hash) : undefined;
    }
    private isDarkInPath(): boolean{
        if(!this.url){
            return false;
        }
        if(this.viteContentType === 'served'){
            return this.url.searchParams.get('dark') === 'true'
        }
        return /\/index-dark\.html$/.test(this.url.pathname)
    }
    public addDarkToPath(dark: boolean): DarkableUrl{
        if(!this.url){
            return this;
        }
        if(this.viteContentType === 'served'){
            if(!dark){
                this.url.searchParams.delete('dark')
                return this;
            }
            this.url.searchParams.set('dark', 'true');
            return this;
        }
        if(dark){
            this.url.pathname = this.url.pathname.replace(/\/(?:index\.html)?$/, '/index-dark.html')
        }else{
            this.url.pathname = this.url.pathname.replace(/\/index-dark\.html$/, '/')
        }
        return this;
    }
    public hasChange(): boolean{
        if(!this.url || !this.urlLikeHash){
            return false;
        }
        const darkSeachParamInHash = this.urlLikeHash.url.searchParams.get('dark');
        if(!darkSeachParamInHash){
            return false;
        }
        if(this.isDarkInPath()){
            return darkSeachParamInHash === 'false'
        }
        return darkSeachParamInHash === 'true'
    }
    public removeChange(): void{
        if(!this.url || !this.urlLikeHash){
            return;
        }
        this.urlLikeHash.url.searchParams.delete('dark')
        this.url.hash = this.urlLikeHash.getHash();
    }
    public addDarkToHash(dark: boolean): DarkableUrl{
        if(!this.url || !this.urlLikeHash){
            return this;
        }
        this.urlLikeHash.url.searchParams.set('dark', dark ? 'true' : 'false')
        this.url.hash = this.urlLikeHash.getHash();
        return this;
    }
    public toString(): string{
        return this.url ? this.url.toString() : '';
    }
}