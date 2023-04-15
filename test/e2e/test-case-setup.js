const fs = require('fs')
const path = require('path')

class TestCasesListScriptBuilder{
    constructor(testCaseDirRelativePath){
        this.testCaseDirRelativePath = testCaseDirRelativePath;
        this.cases = [];
        this.counter = 0;
    }
    addCaseWithFileName(fileName){
        const id = fileName.replace(/\.mjs$/,'')
        const counter = this.counter++;
        const importVarName = `var${counter}`
        const importLocation = `${this.testCaseDirRelativePath}/${fileName}`;
        const fullPath = path.resolve(__dirname, importLocation);
        this.cases.push({id, importVarName, importLocation, fullPath})
    }
    build(){
        return `${this.cases.map(({importVarName, importLocation}) => `import ${importVarName} from '${importLocation}'\r\n`).join('')}` +
        `export default [${this.cases.map(({importVarName, fullPath, id}) => `{id: '${id}', fullPath: '${fullPath.replace(/\\/g,'\\\\')}',skipped:!!${importVarName}.skipped,focussed:!!${importVarName}.focussed}`).join(',')}]`;
    }
}

function getTestCasesToRun(list){
    const focussed = list.filter(c => c.focussed);
    if(focussed.length){
        return focussed;
    }
    return list.filter(c => !c.skipped);
}

module.exports = async function(){
    const testCasesListRelativePath = './test-cases-list.mjs'
    global.__TEST_CASE_LIST_RELATIVE_PATH__ = testCasesListRelativePath;
    const testCaseListPath = path.resolve(__dirname, testCasesListRelativePath);
    global.__TEST_CASE_LIST_PATH__ = testCaseListPath;
    const testCasesToRunPath = path.resolve(__dirname, './test-cases-to-run.ts');
    global.__TEST_CASES_TO_RUN_PATH__ = testCasesToRunPath;
    global.__TEST_CASES_TO_RUN_ORIGINAL_CONTENT__ = fs.readFileSync(testCasesToRunPath, {encoding: 'utf8'});
    const testCaseDirRelativePath = '../test-cases';
    const testCaseDirPath = path.resolve(__dirname, testCaseDirRelativePath);
    const testCaseFileNames = fs.readdirSync(testCaseDirPath);
    const builder = new TestCasesListScriptBuilder(testCaseDirRelativePath);
    for(let testCaseFileName of testCaseFileNames){
        builder.addCaseWithFileName(testCaseFileName);
    }
    const script = builder.build();
    fs.writeFileSync(testCaseListPath, script, {encoding: 'utf8'})
    await import(testCasesListRelativePath).then(({default: list}) => {
        const testCasesToRun = getTestCasesToRun(list);
        const testCasesToRunContent = `export default ${JSON.stringify(testCasesToRun.map(({fullPath, id}) => ({fullPath, id})))}`
        fs.writeFileSync(testCasesToRunPath, testCasesToRunContent, {encoding: 'utf8'})
    })
}