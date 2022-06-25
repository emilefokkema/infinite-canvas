export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.setLineDash([5, 15]);
        ctx.moveTo(0, 50);
        ctx.lineTo(300, 50);
        ctx.stroke();

        // Solid line
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(0, 100);
        ctx.lineTo(300, 100);
        ctx.stroke();
    },
    title: "set different lineDash"
}