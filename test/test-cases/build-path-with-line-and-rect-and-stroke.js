export default {
    code: function(ctx){
        ctx.lineWidth = 15;

        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(130, 130);
        ctx.rect(40, 40, 70, 70);
        ctx.stroke();
    },
    title: "build a path with line and a rect and stroke it"
}