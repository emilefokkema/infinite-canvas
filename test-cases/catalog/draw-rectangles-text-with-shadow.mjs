export default {
    code: function(ctx){
        ctx.fillStyle ="#f00";
        ctx.shadowColor = "#000";
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowBlur = 10;
        ctx.font = '50px sans-serif';
        ctx.fillRect(10, 20, 100, 100);
        ctx.fillStyle = "#00f"
        ctx.fillText("text", 50, 50);
        ctx.translate(90, 120);
        ctx.scale(0.5, 0.5);
        ctx.fillRect(0, 0, 40, 40);
    },
    title: "draw rectangles and text with shadow"
}