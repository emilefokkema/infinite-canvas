export function splitOnWordBoundary(input: string, maxWordLength: number): [string, string]{
    const rgx = /(\w+)\W*/g
    let match: RegExpExecArray | null = null;
    let currentLength = 0;
    while((match = rgx.exec(input))){
        const wordLength = match[1].length;
        if(currentLength + wordLength > maxWordLength){
            break;
        }
        currentLength += match[0].length;
    }
    return [input.substring(0, currentLength), input.substring(currentLength)]
}