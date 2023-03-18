const fs = require('fs')

function getTestCasesToRun(list){
    const focussed = list.filter(c => c.focussed);
    if(focussed.length){
        return focussed;
    }
    return list.filter(c => !c.skipped);
}

module.exports = async function(){
    await import(global.__TEST_CASE_LIST_RELATIVE_PATH__).then(({default: list}) => {
        const haveRun = getTestCasesToRun(list);
        const numberSkipped = list.length - haveRun.length;
        if(numberSkipped > 0){
            console.warn(`\x1b[33m${numberSkipped} test case(s) has/have been skipped!\x1b[0m`)
        }
        fs.unlinkSync(global.__TEST_CASE_LIST_PATH__)
        fs.writeFileSync(global.__TEST_CASES_TO_RUN_PATH__, global.__TEST_CASES_TO_RUN_ORIGINAL_CONTENT__, {encoding: 'utf8'})
    });
    
}