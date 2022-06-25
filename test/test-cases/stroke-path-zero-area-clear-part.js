export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(40, 40);
        ctx.stroke();
        ctx.clearRect(30, 30, 20, 20);
    },
    title: "stroke a path with zero area and clear part of it"
}