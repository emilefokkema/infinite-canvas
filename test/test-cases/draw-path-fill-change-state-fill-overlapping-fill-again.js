export default {
    code:function(ctx){
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(100, 0);
        ctx.lineTo(100, 100);
        ctx.lineTo(0, 100);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.fillStyle = "#00f";
        ctx.fillRect(50, 50, 100, 100);
        ctx.fill();
    },
    title: "draw a path, fill it, change state, fill an overlapping rect and fill the path again",
}