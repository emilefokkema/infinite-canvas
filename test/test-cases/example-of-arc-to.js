export default {
    code:function(ctx){
        // Tangential lines
        ctx.beginPath();
        ctx.strokeStyle = 'gray';
        ctx.moveTo(200, 20);
        ctx.lineTo(200, 130);
        ctx.lineTo(50, 20);
        ctx.stroke();

        // Arc
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.moveTo(200, 20);
        ctx.arcTo(200,130, 50,20, 40);
        ctx.stroke();

        // Start point
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(200, 20, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Control points
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(200, 130, 5, 0, 2 * Math.PI); // Control point one
        ctx.arc(50, 20, 5, 0, 2 * Math.PI);   // Control point two
        ctx.fill();
    },
    title: "example of arcTo"
}