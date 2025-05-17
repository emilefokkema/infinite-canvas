export default {
    code(ctx){
        ctx.font = '48px sans-serif';
        ctx.save();
        ctx.filter = 'blur(4px)';
        ctx.fillText('Hello world', 50, 100);
        ctx.translate(50, 100)
        ctx.scale(5, 5)
        ctx.fillText('Hello world', 10, 10);
        ctx.restore();
        ctx.fillText('Hello world', 50, 200);
        ctx.filter = 'drop-shadow(20px 20px 5px red)';
        ctx.fillText('Hello world', 50, 250);
    },
    title: "filter"
}