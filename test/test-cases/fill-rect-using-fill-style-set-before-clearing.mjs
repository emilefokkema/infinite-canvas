export default {
    code: function(ctx){
        ctx.fillStyle = "#f00";
        ctx.fillRect(10, 10, 20, 20);
        ctx.fillStyle = "#00f";
        ctx.clearRect(20, 0, 40, 40);
        ctx.fillRect(30, 10, 10, 10);
    },
    title: "fillRect using a fillStyle that was set right before clearing a rect"
}