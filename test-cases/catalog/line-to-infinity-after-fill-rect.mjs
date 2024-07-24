export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100, 200);
        ctx.fillRect(20, 20, 50, 50);
        ctx.lineToInfinityInDirection(1, 0);
        ctx.fill();
    },
    finiteCode: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100, 200);
        ctx.fillRect(20, 20, 50, 50);
        ctx.lineTo(1000, 200);
        ctx.lineTo(1000, 100);
        ctx.fill();
    },
    title: "line to infinity after a fillRect"
}