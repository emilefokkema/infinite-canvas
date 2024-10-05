const urlPrefix = 'http://www.example.com'

export class UrlLikeHash{
    private constructor(public readonly url: URL){

    }

    public getHash(): string{
        return this.url.toString().substring(urlPrefix.length)
    }

    public static tryCreate(hash: string | undefined): UrlLikeHash | undefined{
        if(!hash){
            return new UrlLikeHash(new URL(`${urlPrefix}`))
        }
        try{
            const stringToTry = `${urlPrefix}${hash.replace(/^#/, '')}`
            const u = new URL(stringToTry)
            return new UrlLikeHash(u);
        }catch{
            return undefined;
        }
    }
}