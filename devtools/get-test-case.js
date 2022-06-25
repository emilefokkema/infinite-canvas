import testCases from './temp/test-cases';

export default function getTestCase(testCaseId){
    const testCase = testCases.find(c => c.id === testCaseId);
    if(!testCase){
        throw new Error(`cannot find test case by id ${testCaseId}`);
    }
    return testCase.definition;
}