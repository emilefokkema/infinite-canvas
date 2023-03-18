export default {
    code: function(ctx){
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(10, 10, 50, 50);
        ctx.save();
        ctx.clip();
        ctx.fillRect(-1, -1, 2, 2);
        ctx.stroke();
    },
    title: "begin a path, save, clip, fill a rect and stroke the clipped path"
}