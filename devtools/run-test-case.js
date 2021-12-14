import pixelmatch from 'pixelmatch'

function whenInfiniteCanvasHasDrawn(infiniteCanvas){
    return new Promise((res) => {
        infiniteCanvas.addEventListener('draw', () => res());
    });
}
export default async function runTestCase({regularCanvasElement, infiniteCanvasElement, testCase, logError, createDiffImage}){
    regularCanvasElement.width = 400;
    regularCanvasElement.height = 400;
    const regularCanvasContext = regularCanvasElement.getContext('2d');
    infiniteCanvasElement.width = 400;
    infiniteCanvasElement.height = 400;
    const infiniteCanvas = new InfiniteCanvas(infiniteCanvasElement);
    const infiniteCanvasContext = infiniteCanvas.getContext('2d');
    const drawnPromise = whenInfiniteCanvasHasDrawn(infiniteCanvas);
    try{
        (testCase.finiteCode || testCase.code)(regularCanvasContext);
    }catch(e){
        const errorMessage = 'The test case code threw an error when run for the `CanvasRenderingContext2D` of the regular canvas. See the console for details';
        if(logError){
            console.error(e);
        }
        return {
            result: 'fail',
            errorMessage
        };
    }
    try{
        testCase.code(infiniteCanvasContext);
    }catch(e){
        const errorMessage = 'The test case code threw an error when run for the `CanvasRenderingContext2D` of the infinite canvas. See the console for details';
        if(logError){
            console.error(e);
        }
        return {
            result: 'fail',
            errorMessage
        };
    }
    await drawnPromise;
    const regularImageData = regularCanvasContext.getImageData(0, 0, 400, 400);
    const infiniteImageData = infiniteCanvasElement.getContext('2d').getImageData(0, 0, 400, 400);
    if(createDiffImage){
        const diffImageData = new ImageData(400, 400);
        const numDiffPixels = pixelmatch(regularImageData.data, infiniteImageData.data, diffImageData.data, 400, 400, {threshold: 0.1});
        if(numDiffPixels === 0){
            return {result: 'pass'};
        }else{
            return {
                result: 'fail',
                diffImageData: diffImageData,
                errorMessage: 'Images are not equal'
            };
        }
    }else{
        const numDiffPixels = pixelmatch(regularImageData.data, infiniteImageData.data, null, 400, 400, {threshold: 0.1});
        if(numDiffPixels === 0){
            return {result: 'pass'};
        }else{
            return {
                result: 'fail',
                errorMessage: 'Images are not equal'
            };
        }
    }
    
}