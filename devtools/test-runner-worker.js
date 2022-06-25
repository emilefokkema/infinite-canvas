import runTestCase from './run-test-case';
import getTestCase from './get-test-case';
import getSearchParamsFromURLHash from '../runtime-utils/get-search-params-from-url-hash';

const params = getSearchParamsFromURLHash();
const testCaseId = params.get('testCaseId');
const createDiffImage = params.get('createDiffImage');
const testCase = getTestCase(testCaseId);
const regularCanvasElement = document.getElementById('regularCanvas');
const infiniteCanvasElement = document.getElementById('infiniteCanvas');
runTestCase({regularCanvasElement, infiniteCanvasElement, testCase, logError: false, createDiffImage}).then((result) => {
    if(!createDiffImage){
        const {result: passOrFail} = result;
        if(parent){
            parent.postMessage({result: passOrFail});
        }
    }else{
        const {result: passOrFail, diffImageData, errorMessage} = result;
        if(parent){
            parent.postMessage({result: passOrFail, diffImageData, errorMessage});
        }
    }
});