export default {
    code:function(ctx){
        ctx.fillStyle = "#f00";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "#00f";
        ctx.clearRect(0, 0, 50, 50);
        ctx.fillRect(25, 25, 50, 50);
    },
    title: "fillRect using a fillStyle that was set right before clearing a rect"
}