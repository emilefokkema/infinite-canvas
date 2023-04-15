export default {
    code:function(ctx){
        // Draw yellow background
        ctx.beginPath();
        ctx.fillStyle = '#ff6';
        ctx.fillRect(0, 0, 200, 200);

        // Draw blue triangle
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.moveTo(20, 20);
        ctx.lineTo(180, 20);
        ctx.lineTo(130, 130);
        ctx.closePath();
        ctx.fill();

        // Clear part of the canvas
        ctx.clearRect(10, 10, 120, 100);
    },
    title: "clear a rectangle that overlaps the drawing"
}