export default {
    code: function(ctx){
        // First path
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(20, 20);
        ctx.lineTo(200, 20);
        ctx.stroke();

        // Second path
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.moveTo(20, 20);
        ctx.lineTo(120, 120);
        ctx.stroke();
    },
    title: "stroke two different paths with two different strokeStyles"
}