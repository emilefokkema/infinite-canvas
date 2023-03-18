export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(10, 10);
        ctx.lineTo(10, 90);
        ctx.lineTo(30, 90);
        ctx.fillStyle = "#f00";
        ctx.fill();
        ctx.lineTo(90, 90);
        ctx.fillStyle = "#00f";
        ctx.fill();
        ctx.clearRect(0, 0, 40, 100);
    },
    title: "make path, fill, expand, fill, clearRect"
}