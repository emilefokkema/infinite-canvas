export default {
    code:function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.rect(20, 20, 40, 40);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(40, 40, 22, 0, 2 * Math.PI);
        ctx.clip();
        ctx.beginPath();
        ctx.rect(0, 0, 80, 80);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(0, 0, 20, 20);
        ctx.restore();
        ctx.fill();
    },
    title: "save, clip twice, fill, make rect, restore and fill"
}