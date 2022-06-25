export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.lineTo(50, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();
    },
    title: "drawing a line without calling 'moveTo'"
}