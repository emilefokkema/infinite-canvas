export default {
    code:function(ctx){
        ctx.save();
        ctx.translate(100, 100);
        ctx.beginPath();
        ctx.rect(0, 0, 90, 90);
        ctx.save();
        ctx.fillStyle = "#bbb"
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillRect(0, 0, 100, 50);
        ctx.restore();
        ctx.stroke();
        ctx.restore();
        ctx.fillRect(0, 0, 20, 20)
    },
    title: "save, create path, fill two rects, restore and stroke"
}