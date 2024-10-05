export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.rect(20, 20, 160, 160);
        ctx.clip();
        ctx.fillRect(0, 100, 40, 40);
        ctx.beginPath();
        ctx.rect(40, 40, 120, 120);
        ctx.clip();
        ctx.fillRect(140, 100, 40, 40);
        ctx.fillRect(100, 100, 20, 40);
        ctx.clearRect(130, 90, 40, 60);
    },
    title: "clip with a rect, fill a rect, clip with another rect and then fill two rects and then remove the second filled rectangle by clearing a rect"
}