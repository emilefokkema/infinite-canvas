export default {
    code:function(ctx){
        ctx.fillStyle = "#f00";
        ctx.save();
        ctx.fillStyle = "#00f";
        ctx.beginPath();
        ctx.rect(0, 0, 10, 10);
        ctx.restore();
        ctx.fillRect(10, 10, 20, 20);
        ctx.fill();
    },
    title: "restore, fillRect and fill"
}