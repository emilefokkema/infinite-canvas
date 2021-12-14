import getTextContent from '../runtime-utils/get-text-content';

class TestRunnerWorker{
    constructor(workerUrl){
        this.workerUrl = workerUrl;
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('style','visibility: hidden;');
        document.body.appendChild(this.iframe);
        this.busy = false;
        this.currentTestCase = undefined;
        this.hasRun = false;
    }
    runTestCase(spec){
        this.busy = true;
        this.currentTestCase = spec;
        spec.onStarted();
        return new Promise((res) => {
            const listener = (event) => {
                if(event.source === this.iframe.contentWindow && event.origin === location.origin){
                    const result = event.data;
                    spec.onResult(result);
                    removeEventListener('message', listener);
                    this.busy = false;
                    this.hasRun = true;
                    res();
                }
            };
            addEventListener('message', listener);
            const url = new URL(this.workerUrl);
            const params = new URLSearchParams();
            params.set('testCaseId', encodeURI(spec.testCaseId));
            if(spec.createDiffImage){
                params.set('createDiffImage', true);
            }
            url.hash = params.toString();
            this.iframe.src = url.toString();
            if(this.hasRun){
                this.iframe.contentWindow.location.reload();
            }
        });
    }
}

export class TestRunner{
    constructor(numberOfWorkers){
        this.numberOfWorkers = numberOfWorkers;
        this.workers = undefined;
        this.queue = [];
    }
    runNextTestCase(){
        if(this.queue.length === 0){
            return;
        }
        const freeWorker = this.workers.find(w => !w.busy);
        if(!freeWorker){
            return;
        }
        const caseSpec = this.queue.pop();
        freeWorker.runTestCase(caseSpec).then(() => this.runNextTestCase());
    }
    runTestCase(spec){
        this.queue.unshift(spec);
        this.runNextTestCase();
    }
    async initialize(){
        let html = await getTextContent('test-runner-worker.html');
        html = html.replace('INSERTBASEHREFHERE', document.baseURI);
        const blob = new Blob([html], {type : 'text/html'});
        const objectURL = URL.createObjectURL(blob);
        this.workers = Array.apply(null, new Array(this.numberOfWorkers)).map(() => new TestRunnerWorker(objectURL));
    }
}