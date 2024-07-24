export default {
    code: (ctx) => {
        // Rounded rectangle with zero radius (specified as a number)
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.roundRect(10, 20, 150, 100, 0);
        ctx.stroke();

        // Rounded rectangle with 40px radius (single element list)
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.roundRect(10, 20, 150, 100, [40]);
        ctx.stroke();

        // Rounded rectangle with 2 different radii
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.roundRect(10, 150, 150, 100, [10, 40]);
        ctx.stroke();

        // Rounded rectangle with four different radii
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.roundRect(190, 20, 200, 100, [0, 30, 50, 60]);
        ctx.stroke();

        // Same rectangle drawn backwards
        ctx.strokeStyle = "magenta";
        ctx.beginPath();
        ctx.roundRect(390, 150, -200, 100, [0, 30, 50, 60]);
        ctx.stroke();
    },
    title: 'round rect'
}