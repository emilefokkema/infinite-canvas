export default {
    code:function(ctx){
        var gradient1 = ctx.createLinearGradient(0, 0, 0, 100);
        gradient1.addColorStop(0, "#f00");
        gradient1.addColorStop(1, "#00f");
        var gradient2 = ctx.createLinearGradient(0, 0, 0, 100);
        gradient2.addColorStop(0, "#00f");
        gradient2.addColorStop(1, "#f00");
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 5;
        ctx.font = '80px sans-serif';
        ctx.strokeStyle = gradient1;
        ctx.fillStyle = gradient2;
        ctx.strokeText("Text", 0, 70);
        ctx.fillText("Text", 0, 70);
    },
    title: "fill and stroke text with gradient"
};