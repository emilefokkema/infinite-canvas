import getTextContent from '../runtime-utils/get-text-content';
import testCases from './temp/test-cases';
import { TestRunner } from './test-runner';


const testRunner = new TestRunner(3);

new Vue({
    el: '#app',
    data: function(){
        return {
            queuedTestCases: [],
            runningTestCases: [],
            passedTestCases: [],
            failedTestCases: [],
            ignoredTestCases: []
        };
    },
    mounted: function(){
        const focusedCasesPresent = testCases.some(c => c.definition.focused);
        if(focusedCasesPresent){
            for(let testCase of testCases){
                if(testCase.definition.focused){
                    this.queuedTestCases.push(testCase);
                }else{
                    this.ignoredTestCases.push(testCase);
                }
            }
        }else{
            for(let testCase of testCases){
                if(testCase.definition.ignored){
                    this.ignoredTestCases.push(testCase);
                }else{
                    this.queuedTestCases.push(testCase);
                }
            }
        }
        testRunner.initialize().then(() => {
            const casesToQueue = this.queuedTestCases.slice();
            for(let queuedTestCase of casesToQueue){
                testRunner.runTestCase({
                    testCaseId: queuedTestCase.id,
                    onStarted: () => this.setRunning(queuedTestCase),
                    onResult: (result) => this.onTestCaseResult(queuedTestCase, result)
                });
            }
        });
    },
    methods: {
        setRunning(testCase){
            const index = this.queuedTestCases.indexOf(testCase);
            if(index === -1){
                return;
            }
            this.queuedTestCases.splice(index, 1);
            this.runningTestCases.push(testCase);
        },
        onTestCaseResult(testCase, {result}){
            const index = this.runningTestCases.indexOf(testCase);
            if(index === -1){
                return;
            }
            this.runningTestCases.splice(index, 1);
            if(result === 'pass'){
                this.passedTestCases.push(testCase);
            }else if(result === 'fail'){
                this.failedTestCases.push(testCase);
            }
        }
    },
    components: {
        'test-case': {
            template: document.getElementById('testCaseTemplate').innerHTML,
            props: {
                testcase: Object,
                toqueue: Boolean
            },
            methods: {
                onInspectClick(){
                    window.open(this.testCaseUrl);
                }
            },
            computed: {
                testCaseUrl(){
                    return `test-case.html#testCaseId=${encodeURI(this.testcase.id)}`
                }
            }
        },
        'use-cases-list': {
            template: document.getElementById('useCasesListTemplate').innerHTML,
            data: function(){
                return {
                    list: []
                };
            },
            mounted: async function(){
                this.list = JSON.parse(await getTextContent('use-cases-summary.json'));
            },
            components: {
                'use-case': {
                    template: document.getElementById('useCaseTemplate').innerHTML,
                    props: {
                        usecase: Object
                    },
                    computed: {
                        url(){
                            return `use-case#id=${this.usecase.id}`
                        }
                    }
                }
            }
        }
    }
})