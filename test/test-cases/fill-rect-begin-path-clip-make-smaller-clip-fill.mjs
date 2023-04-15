export default {
    code:function(ctx){
        ctx.fillStyle = "#f00"
        ctx.fillRect(0, 0, 100, 100);
        ctx.beginPath();
        ctx.moveTo(10,10);
        ctx.lineTo(10,90);
        ctx.lineTo(90,90);
        ctx.lineTo(90,10);
        ctx.clip();
        ctx.fillStyle = "#0f0"
        ctx.fill();
        ctx.lineTo(70,30);
        ctx.clip();
        ctx.fillStyle = "#00f";
        ctx.fillRect(0,0,100,100);
    },
    title: "fill a rect, begin a path, clip, make it smaller, clip and fill"
}