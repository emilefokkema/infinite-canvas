export default {
    code: function(ctx){
        ctx.translate(10, 10);
        ctx.fillRect(0, 0, 100, 100);
        ctx.translate(30, 30);
        ctx.rotate(0.2);
        ctx.clearRect(0, 0, 20, 20);
    },
    title: "translate, fill a rect, translate and rotate, clear a rect"
}