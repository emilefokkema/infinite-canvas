import { UrlLikeHash } from '../../../../utils/frontend/url-like-hash'

export interface TestCaseRouter{
    getTestCaseId(): string | undefined;
}

export function createTestCaseRouter(): TestCaseRouter{
    function getTestCaseId(): string | undefined {
        const urlLikeHash = UrlLikeHash.tryCreate(new URL(window.location.href).hash);
        if(!urlLikeHash){
            return;
        }
        return urlLikeHash.url.pathname.replace(/^\//, '')
    }
    return { getTestCaseId }
}