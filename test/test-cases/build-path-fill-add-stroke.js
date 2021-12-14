export default {
    code: function(ctx){
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(30,30);
        ctx.lineTo(30,100);
        ctx.lineTo(100,100);
        ctx.fill();
        ctx.strokeStyle = "#00f";
        ctx.lineTo(100,30);
        ctx.stroke();
    },
    title: "build a path, fill it, add to it and stroke it"
}