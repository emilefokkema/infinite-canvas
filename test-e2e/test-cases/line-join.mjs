export default {
    code(ctx){
        ctx.lineWidth = 20;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(190, 100);
        ctx.lineTo(280, 20);
        ctx.lineTo(280, 150);
        ctx.stroke();
    },
    title: "lineJoin"
}