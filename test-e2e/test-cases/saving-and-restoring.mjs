export default {
    code: function(ctx){
        // Save the default state
        ctx.save();

        ctx.fillStyle = 'green';
        ctx.fillRect(10, 10, 100, 100);

        // Restore the default state
        ctx.restore();

        ctx.fillRect(150, 40, 100, 100);
    },
    title: "saving and restoring"
}