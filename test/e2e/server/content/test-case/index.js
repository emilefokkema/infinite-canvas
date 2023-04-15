var executeTestCase;
function loadTestCase(testCase){
    const canvasEl = document.getElementById('canvas');
    if(testCase.distortion){
        const {screenWidth, screenHeight, viewboxWidth, viewboxHeight} = testCase.distortion;
        canvasEl.width = viewboxWidth;
        canvasEl.height = viewboxHeight;
        canvasEl.style.width = screenWidth;
        canvasEl.style.height = screenHeight;
    }else{
        const {width, height} = canvasEl.getBoundingClientRect();
        canvasEl.width = width;
        canvasEl.height = height;
    }
    
    const infCanvas = new InfiniteCanvas(canvasEl);
    const ctx = infCanvas.getContext('2d');
    executeTestCase = function(){
        return new Promise((res) => {
            infCanvas.addEventListener('draw', res);
            testCase.code(ctx);
        })
    };
}