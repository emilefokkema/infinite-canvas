export default {
    code(ctx){
        ctx.lineJoin = 'miter';
        ctx.lineWidth = 5;
        ctx.miterLimit = 5;
        ctx.beginPath();
        ctx.moveTo(10, 100);
        ctx.lineTo(25, 30);
        ctx.lineTo(30, 100);
        ctx.lineTo(70, 30)
        ctx.stroke()
    },
    title: "miterLimit"
}