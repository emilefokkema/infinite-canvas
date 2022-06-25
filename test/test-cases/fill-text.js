export default {
    title: 'fill text',
    code: function(ctx){
        var gradient = ctx.createLinearGradient(0, 0, 0, 70);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(1, "#fff");
        ctx.fillStyle = gradient;
        ctx.font = "30px sans-serif";
        ctx.fillText("Text", 0, 30);
    }
};