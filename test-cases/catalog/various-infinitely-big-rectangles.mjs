export default {
    code: function(ctx){
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(-Infinity, 20, Infinity, -Infinity);
        ctx.strokeRect(-Infinity, 20, Infinity, -Infinity);

        ctx.fillRect(20, -Infinity, -Infinity, Infinity);
        ctx.strokeRect(20, -Infinity, -Infinity, Infinity);

        ctx.fillRect(-Infinity, 380, Infinity, Infinity);
        ctx.strokeRect(-Infinity, 380, Infinity, Infinity);

        ctx.fillRect(380, -Infinity, Infinity, Infinity);
        ctx.strokeRect(380, -Infinity, Infinity, Infinity);

        ctx.fillRect(40, 40, -Infinity, -Infinity);
        ctx.strokeRect(40, 40, -Infinity, -Infinity);

        ctx.fillRect(360, 40, Infinity, -Infinity);
        ctx.strokeRect(360, 40, Infinity, -Infinity);

        ctx.fillRect(40, 360, -Infinity, Infinity);
        ctx.strokeRect(40, 360, -Infinity, Infinity);

        ctx.fillRect(360, 360, Infinity, Infinity);
        ctx.strokeRect(360, 360, Infinity, Infinity);

        ctx.fillRect(-Infinity, 60, Infinity, 10);
        ctx.strokeRect(-Infinity, 60, Infinity, 10);

        ctx.fillRect(80, -Infinity, 10, Infinity);
        ctx.strokeRect(80, -Infinity, 10, Infinity);

        ctx.fillRect(100, 100, 10, Infinity);
        ctx.strokeRect(100, 100, 10, Infinity);

        ctx.fillRect(120, 120, Infinity, 10);
        ctx.strokeRect(120, 120, Infinity, 10);

        ctx.fillRect(140, 140, 10, -Infinity);
        ctx.strokeRect(140, 140, 10, -Infinity);

        ctx.fillRect(160, 160, -Infinity, 10);
        ctx.strokeRect(160, 160, -Infinity, 10);
    },
    finiteCode: function(ctx){
        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(-10, 20, 1000, -1000);
        ctx.strokeRect(-10, 20, 1000, -1000);

        ctx.fillRect(20, -10, -1000, 1000);
        ctx.strokeRect(20, -10, -1000, 1000);

        ctx.fillRect(-10, 380, 1000, 1000);
        ctx.strokeRect(-10, 380, 1000, 1000);

        ctx.fillRect(380, -10, 1000, 1000);
        ctx.strokeRect(380, -10, 1000, 1000);

        ctx.fillRect(40, 40, -1000, -1000);
        ctx.strokeRect(40, 40, -1000, -1000);

        ctx.fillRect(360, 40, 1000, -1000);
        ctx.strokeRect(360, 40, 1000, -1000);

        ctx.fillRect(40, 360, -1000, 1000);
        ctx.strokeRect(40, 360, -1000, 1000);

        ctx.fillRect(360, 360, 1000, 1000);
        ctx.strokeRect(360, 360, 1000, 1000);

        ctx.fillRect(-10, 60, 1000, 10);
        ctx.strokeRect(-10, 60, 1000, 10);

        ctx.fillRect(80, -10, 10, 1000);
        ctx.strokeRect(80, -10, 10, 1000);

        ctx.fillRect(100, 100, 10, 1000);
        ctx.strokeRect(100, 100, 10, 1000);

        ctx.fillRect(120, 120, 1000, 10);
        ctx.strokeRect(120, 120, 1000, 10);

        ctx.fillRect(140, 140, 10, -1000);
        ctx.strokeRect(140, 140, 10, -1000);

        ctx.fillRect(160, 160, -1000, 10);
        ctx.strokeRect(160, 160, -1000, 10);
    },
    title: "various infinitely big rectangles",
    maxDifference: 157890
}