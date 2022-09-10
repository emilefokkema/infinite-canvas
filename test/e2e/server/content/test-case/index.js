var executeTestCase;
function loadTestCase(testCase){
    const canvasEl = document.getElementById('canvas');
    const {width, height} = canvasEl.getBoundingClientRect();
    canvasEl.width = width;
    canvasEl.height = height;
    createTestCanvas(canvasEl);
    executeTestCase = function(){
        return executeCode(testCase.code);
    };
}