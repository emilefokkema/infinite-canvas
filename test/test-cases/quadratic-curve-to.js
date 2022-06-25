export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(40, 20);
        ctx.translate(40, 20);
        ctx.quadraticCurveTo(20, 0, 20, 20);
        ctx.lineTo(20, 60);
        ctx.fill();
    },
    title: "quadraticCurveTo"
}