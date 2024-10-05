export default {
    code:function(ctx){
        // Create a conic gradient
        // The start angle is 0
        // The center position is 100, 100
        const gradient = ctx.createConicGradient(0, 100, 100);

        // Add five color stops
        gradient.addColorStop(0, "red");
        gradient.addColorStop(0.25, "orange");
        gradient.addColorStop(0.5, "yellow");
        gradient.addColorStop(0.75, "green");
        gradient.addColorStop(1, "blue");

        // Set the fill style and draw a rectangle
        ctx.fillStyle = gradient;
        ctx.fillRect(20, 20, 200, 200);
    },
    title: "fill using conic gradient"
}