export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(50, 0);
        ctx.lineTo(50, 50);
        ctx.lineTo(0, 50);
        ctx.lineTo(0, 0);
        ctx.fillRect(150, 150, 50, 50);
        ctx.fill();
        ctx.beginPath();
        ctx.clearRect(-50, -50, 150, 150);
    },
    title: "make a path, fill a rect, fill the path, begin a new path and then clear a rect containing the first drawn path"
}