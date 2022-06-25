export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.translate(20, 20)
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(20, 0, 20, 20, 40, 20);
        ctx.lineTo(40, 40);
        ctx.lineTo(0, 40);
        ctx.fill();
    },
    title: "bezier curve"
}