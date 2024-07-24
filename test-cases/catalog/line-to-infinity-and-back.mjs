export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineToInfinityInDirection(1, 0);
        ctx.lineTo(200, 200);
        ctx.fill();
    },
    finiteCode: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(1000, 100);
        ctx.lineTo(1000, 200);
        ctx.lineTo(200, 200);
        ctx.fill();
    },
    title: "line to infinity and back"
}