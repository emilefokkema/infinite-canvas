async function isFound(url: string): Promise<boolean>{
    const response = await fetch(url);
    return response.status === 200;
}

const retryInterval = 400;
const maxRetries = 10;

export async function waitUntilFound(url: string): Promise<void>{
    let found = await isFound(url);
    let retryCount = 0;
    while(!found && retryCount < maxRetries){
        console.log(`${url} was not found. Retrying in ${retryInterval}ms...`)
        retryCount++;
        await new Promise(res => setTimeout(res, retryInterval))
        found = await isFound(url);
    }
}