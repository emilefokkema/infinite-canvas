export default {
    code: function(ctx){
        ctx.translate(100, 100);
        ctx.beginPath();
        ctx.moveTo(100, 0);
        ctx.transform(0, 1, -1, 0, 0, 0);
        ctx.lineTo(100, 0);
        ctx.transform(0, 1, -1, 0, 0, 0);
        ctx.lineTo(100, 0);
        ctx.transform(0, 1, -1, 0, 0, 0);
        ctx.lineTo(100, 0);
        ctx.transform(0, 1, -1, 0, 0, 0);
        ctx.lineTo(100, 0);
        ctx.stroke();
    },
    title: "build path by transforming and lineTo the 'same' point"
}