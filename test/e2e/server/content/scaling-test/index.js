async function initialize(){
    const canvasEl = document.getElementById('canvas');
    let { width, height } = canvasEl.getBoundingClientRect();
    const url = new URL(location.href);
    if(url.searchParams.has('width')){
        width = parseInt(url.searchParams.get('width'));
    }
    if(url.searchParams.has('height')){
        height = parseInt(url.searchParams.get('height'));
    }
    canvasEl.width = width;
    canvasEl.height = height;
    createTestCanvas(canvasEl);
    return await executeCode((ctx) => {
        ctx.beginPath();
        ctx.moveToInfinityInDirection(-1, 0);
        ctx.lineTo(100, 100);
        ctx.lineToInfinityInDirection(1, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveToInfinityInDirection(0, -1);
        ctx.lineTo(100, 100);
        ctx.lineToInfinityInDirection(0, 1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(200, 100, 25, 0, 2 * Math.PI);
        ctx.fill();
    });
}
