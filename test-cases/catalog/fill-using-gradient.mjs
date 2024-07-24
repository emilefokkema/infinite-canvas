export default {
    code:function(ctx){
        var gradient = ctx.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0, "#f00");
        gradient.addColorStop(1, "#00f");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 200);
    },
    title: "fill using gradient"
}