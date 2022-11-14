const dependencyDirection = {
    NONE: 0,
    DEPENDS_ON: 1,
    IS_DEPENDED_ON_BY: 2
};

class FindingVisitor{
    constructor(predicate){
        this.visited = [];
        this.predicate = predicate;
        this.result = null;
    }
    visit(node){
        if(this.result || this.visited.includes(node)){
            return null;
        }
        this.visited.push(node);
        if(this.predicate(node)){
            this.result = node;
            return null;
        }
        return this;
    }
}

class AllFindingVisitor{
    constructor(predicate){
        this.visited = [];
        this.predicate = predicate;
        this.result = [];
    }
    visit(node){
        if(this.visited.includes(node)){
            return null;
        }
        this.visited.push(node);
        if(this.predicate(node)){
            this.result.push(node);
        }
        return this;
    }
}

let depResultVisitorId = 0;

class DepResultVisitor{
    constructor(depResultBuilder, offLimitsNodes){
        this.depResultBuilder = depResultBuilder;
        this.id = depResultVisitorId++;
        this.depResults = [];
        this.node = undefined;
        this.offLimitsNodes = offLimitsNodes || [];
    }
    build(){
        return this.depResultBuilder(this.node.item, this.depResults);
    }
    visit(node, direction){
        //console.log(`DepResultVisitor ${this.id} visiting `, node, direction)
        if(direction === dependencyDirection.IS_DEPENDED_ON_BY){
            return null;
        }
        if(direction === dependencyDirection.NONE){
            if(this.offLimitsNodes.includes(node)){
                throw new Error('circle!')
            }
            this.node = node;
            return this;
        }else{
            const visitor = new DepResultVisitor(this.depResultBuilder, this.offLimitsNodes.concat([this.node]));
            node.acceptVisitor(visitor, dependencyDirection.NONE);
            this.depResults.push(visitor.build())
            return null;
        }
    }
}

class DepTreeNode{
    constructor(item){
        this.item = item;
        this.dependsOn = [];
        this.isDependedOnBy = [];
    }
    find(predicate){
        const finder = new FindingVisitor(predicate);
        this.acceptVisitor(finder, dependencyDirection.NONE);
        return finder.result;
    }
    findAll(predicate){
        const finder = new AllFindingVisitor(predicate);
        this.acceptVisitor(finder, dependencyDirection.NONE);
        return finder.result;
    }
    useDependencies(depResultBuilder){
        const visitor = new DepResultVisitor(depResultBuilder);
        this.acceptVisitor(visitor, dependencyDirection.NONE);
        const result = visitor.build();
        return result;
    }
    acceptVisitor(visitor, direction){
        visitor = visitor.visit(this, direction);
        if(!visitor){
            return;
        }
        for(let dependsOn of this.dependsOn){
            dependsOn.acceptVisitor(visitor, dependencyDirection.DEPENDS_ON);
        }
        for(let isDependedOnBy of this.isDependedOnBy){
            isDependedOnBy.acceptVisitor(visitor, dependencyDirection.IS_DEPENDED_ON_BY);
        }
    }
}

function groupByAffiliation(items, belongTogether){
    const itemsCopy = items.slice();
    const result = [];
    let currentGroup = null;
    while(itemsCopy.length > 0){
        let nextItem;
        if(currentGroup === null){
            [nextItem] = itemsCopy.splice(0, 1);
            currentGroup = [nextItem];
        }else{
            const nextItemIndex = itemsCopy.findIndex(i => currentGroup.some(j => belongTogether(i, j)));
            if(nextItemIndex === -1){
                result.push(currentGroup);
                currentGroup = null;
            }else{
                [nextItem] = itemsCopy.splice(nextItemIndex, 1);
                currentGroup.push(nextItem);
            }
        }
    }
    if(currentGroup !== null){
        result.push(currentGroup);
    }
    return result;
}

function createDepTree(items, dependsOn){
    let result = null;
    for(let item of items){
        const node = new DepTreeNode(item);
        if(result === null){
            result = node;
        }else{
            const dependentNode = result.find(n => dependsOn(n.item, item));
            if(dependentNode){
                dependentNode.dependsOn.push(node);
                node.isDependedOnBy.push(dependentNode);
            }else{
                const dependency = result.find(n => dependsOn(item, n.item));
                if(dependency){
                    node.dependsOn.push(dependency);
                    dependency.isDependedOnBy.push(node);
                }
            }
        }
    }
    const roots = result.findAll(n => n.isDependedOnBy.length === 0);
    return roots;
}

export default function createDepTrees(items, dependsOn){
    const grouped = groupByAffiliation(items, (i, j) => dependsOn(i, j) || dependsOn(j, i));
    const roots = [];
    for(let group of grouped){
        const result = createDepTree(group, dependsOn);
        roots.push(...result);
    }
    return roots;
}