async function initialize(){
    const canvasEl = document.getElementById('canvas');
    canvasEl.width = 400;
    canvasEl.height = 400;
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
