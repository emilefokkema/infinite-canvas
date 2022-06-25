export default {
    code:function(ctx){
        ctx.fillStyle = "#f00";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "#00f";
        ctx.beginPath();
        ctx.moveTo(50,0);
        ctx.lineTo(50,50);
        ctx.lineTo(0,50);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.clearRect(0, 0, 75, 75);
        ctx.fill();
    },
    title: "set a fillStyle, build a path, clear a rect and fill the path"
}