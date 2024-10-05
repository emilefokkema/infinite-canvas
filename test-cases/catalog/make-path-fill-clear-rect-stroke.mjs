export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10, 90);
        ctx.lineTo(90, 90);
        ctx.fill();
        ctx.clearRect(0, 0, 100, 100);
        ctx.lineTo(90, 10);
        ctx.stroke();
    },
    title: "make path, fill, clearRect and stroke"
}