export default {
    code: function(ctx){
        ctx.lineWidth = 4;
        function drawSomething(){
            ctx.strokeRect(0, 0, 30, 30);
            ctx.beginPath();
            ctx.moveTo(30, 30);
            ctx.lineToInfinityInDirection(1, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(30, 30);
            ctx.lineToInfinityInDirection(0, 1);
            ctx.stroke();
            ctx.strokeRect(60, 60, 100, 100);
        }

        ctx.strokeStyle = "#f00";
        drawSomething();

        ctx.translate(100, 100);
        ctx.strokeStyle = "#0f0";
        drawSomething();

        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = "#00f";
        drawSomething();

        ctx.transform(1, 1, 0, 1, 0, 0);
        ctx.strokeStyle = "#ff0";
        drawSomething();
    },
    finiteCode: function(ctx){
        ctx.lineWidth = 4;
        function drawSomething(){
            ctx.strokeRect(0, 0, 30, 30);
            ctx.beginPath();
            ctx.moveTo(30, 30);
            ctx.lineTo(30 + 1000, 30);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(30, 30);
            ctx.lineTo(30, 30 + 1000);
            ctx.stroke();
            ctx.strokeRect(60, 60, 100, 100);
        }

        ctx.strokeStyle = "#f00";
        drawSomething();

        ctx.translate(100, 100);
        ctx.strokeStyle = "#0f0";
        drawSomething();

        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = "#00f";
        drawSomething();

        ctx.transform(1, 1, 0, 1, 0, 0);
        ctx.strokeStyle = "#ff0";
        drawSomething();
    },
    title: "infinite rays, transformed",
    maxDifference: 3381069
}