export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.translate(100, 0);
        ctx.moveTo(0,0);
        ctx.translate(0, 100);
        ctx.lineTo(0,0);
        ctx.translate(-100,0);
        ctx.lineTo(0,0);
        ctx.translate(0, -100);
        ctx.lineTo(0,0);
        ctx.fill();
        ctx.clearRect(50, 0, 200, 200);
    },
    title: "build a path by translating instead of lineTo a different point. then clearRect part of it"
}