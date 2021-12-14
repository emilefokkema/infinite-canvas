export default {
    code:function(ctx){
        ctx.fillStyle = '#ff6';
        ctx.fillRect(0, 0, 200, 200);
        ctx.translate(50, 50);
        ctx.clearRect(0, 0, 100, 100);
    },
    title: "translate before clearing a rect"
}