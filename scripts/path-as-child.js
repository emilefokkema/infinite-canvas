import path from 'path'

export function getPathAsChildOf(childPath, possibleParents){
    for(const possibleParent of possibleParents){
        const relative = path.relative(possibleParent, childPath);
        if(/^\.\./.test(relative)){
            continue;
        }
        return {
            path: childPath,
            parent: possibleParent,
            relative
        }
    }
    return undefined;
}