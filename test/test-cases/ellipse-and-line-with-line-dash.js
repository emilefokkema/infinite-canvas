export default {
    code:function(ctx){
        // Draw the ellipse
        ctx.beginPath();
        ctx.ellipse(100, 100, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw the ellipse's line of reflection
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(0, 200);
        ctx.lineTo(200, 0);
        ctx.stroke();
    },
    title: "an ellipse and a line with a lineDash",
    maxDifference:1
}