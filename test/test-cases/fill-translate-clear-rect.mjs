export default {
    code: function(ctx){
        ctx.fillRect(0, 0, 100, 100);
        ctx.beginPath();
        ctx.translate(20, 20);
        ctx.clearRect(20, 20, 20, 20);
    },
    title: "fill, translate and clear a rect"
}