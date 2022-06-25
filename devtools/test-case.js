import { parse } from 'acorn'
import { compressToEncodedURIComponent } from 'lz-string'
import getTestCase from './get-test-case';
import { TestRunner } from './test-runner';
import getSearchParamsFromURLHash from '../runtime-utils/get-search-params-from-url-hash';

function getCodeFromFunction(fn){
    const fnString = `(${fn.toString()})`
    const { // Program
        body: [
            { // ExpressionStatement
                expression: { // FunctionExpression
                    body: { // BlockStatement
                        body: statements
                    }
                }
            }
        ]
    } = parse(fnString, {ecmaVersion: 2020});
    const firstStart = statements[0].start;
    const lastEnd = statements[statements.length - 1].end;
    let statementsString = fnString.substring(0, firstStart).match(/[^\S\n]*$/)[0] + fnString.substring(firstStart, lastEnd);
    const lineWithContentRegex = /[^\S\n]*\S.*?(?:[\r\n]|$)/g;
    const linesWithContent = statementsString.match(lineWithContentRegex);
    let commonPrefixLength = 0;
    while(linesWithContent.length > 0 &&
        /\s/.test(linesWithContent[0][commonPrefixLength]) &&
        linesWithContent.every(l => l[commonPrefixLength] === linesWithContent[0][commonPrefixLength])){
            commonPrefixLength++;
    }
    statementsString = statementsString.replace(lineWithContentRegex, (match) => match.substring(commonPrefixLength));
    return statementsString;
}

const params = getSearchParamsFromURLHash();
const testCaseId = params.get('testCaseId');
const testCase = getTestCase(testCaseId);
const codeString = getCodeFromFunction(testCase.code);
const finiteCodeString = testCase.finiteCode ? getCodeFromFunction(testCase.finiteCode) : null;
const commonCodeString = testCase.finiteCode ? null : codeString;
const regularCodeString = testCase.finiteCode ? finiteCodeString : null;
const infiniteCodeString = testCase.finiteCode ? codeString : null;

const testRunner = new TestRunner(1);

async function runTestCase(){
    await testRunner.initialize();
    return await new Promise((res) => {
        testRunner.runTestCase({
            testCaseId,
            createDiffImage: true,
            onStarted: () => {},
            onResult: (result) => res(result)
        });
    });
}

Vue.component('code-display', {
    template: document.getElementById('codeDisplayTemplate').innerHTML,
    props: {
        code: String,
        runinplayground: Boolean
    },
    methods: {
        onRunInPlaygroundClick(){
            const compressed = compressToEncodedURIComponent(this.code);
            const url = `playground#code=${compressed}`;
            window.open(url);
        }
    },
    mounted: function(){
        if(this.code){
            const codeDiv = this.$refs.code;
            const editor = ace.edit(codeDiv);
            editor.session.setMode("ace/mode/javascript");
            editor.setValue(this.code);
            editor.clearSelection();
            editor.setReadOnly(true);
        }
    }
});
new Vue({
    el: '#app',
    data: function(){
        const isSmallWidth = window.innerWidth < 700;
        return {
            result: undefined,
            title: testCase.title,
            commonCodeString,
            regularCodeString,
            infiniteCodeString,
            isSmallWidth: isSmallWidth
        };
    },
    computed: {
        hasDifference(){
            return !!this.result && !!this.result.diffImageData;
        },
        errorMessage(){
            return this.result && this.result.errorMessage;
        },
        imagesAreEqual(){
            return this.result && !this.result.errorMessage;
        }
    },
    methods: {
        drawDifference(){
            if(!this.result || !this.result.diffImageData){
                return;
            }
            const diffCanvasElement = this.$refs.differenceCanvasElement;
            const imageData = this.result.diffImageData;
            diffCanvasElement.width = 400;
            diffCanvasElement.height = 400;
            const context = diffCanvasElement.getContext('2d');
            context.putImageData(imageData, 0, 0);
        }
    },
    mounted: function(){
        runTestCase().then((result) => {
            this.result = result;
        });
    },
    components: {
        'result-image': {
            template: document.getElementById('resultImageTemplate').innerHTML,
            props: {
                name: String,
                imagedata: Uint8ClampedArray,
                code: String,
                runfinite: Boolean,
                runinfinite: Boolean,
                issmallwidth: Boolean,
                runinplayground: Boolean
            },
            mounted: function(){
                const canvasElement = this.$refs.canvasElement;
                canvasElement.width = 400;
                canvasElement.height = 400;
                const context = canvasElement.getContext('2d');
                if(this.imagedata){
                    context.putImageData(this.imagedata, 0, 0);
                }else if(this.runfinite){
                    (testCase.finiteCode || testCase.code)(context);
                }else if(this.runinfinite){
                    const infiniteCanvas = new InfiniteCanvas(canvasElement, {greedyGestureHandling: !this.issmallwidth});
                    const infiniteContext = infiniteCanvas.getContext('2d');
                    testCase.code(infiniteContext);
                }
            }
        }
    }
})