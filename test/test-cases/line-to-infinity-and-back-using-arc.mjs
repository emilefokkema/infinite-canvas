export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineToInfinityInDirection(1, 0);
        ctx.arc(100, 150, 50, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();
    },
    finiteCode: function(ctx){
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(1000, 100);
        ctx.lineTo(1000, 200);
        ctx.arc(100, 150, 50, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();
    },
    title: "line to infinity and back using an arc"
}