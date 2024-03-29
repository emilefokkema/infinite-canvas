export default {
    distortion: {
        screenWidth: '400px',
        screenHeight: '400px',
        viewboxWidth: 300,
        viewboxHeight: 150
    },
    code(ctx){
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveToInfinityInDirection(1, 0);
        ctx.lineTo(20, 20);
        ctx.lineToInfinityInDirection(-1, 0);
        ctx.stroke();
    },
    finiteCode(ctx){
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(500, 20);
        ctx.lineTo(20, 20);
        ctx.lineTo(-500, 20)
        ctx.stroke();
    },
    title: 'infinite line, distorted'
}