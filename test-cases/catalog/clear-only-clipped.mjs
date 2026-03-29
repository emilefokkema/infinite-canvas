export default {
    code: function(ctx){
        ctx.fillRect(50, 50, 50, 50);
        ctx.fillRect(200, 200, 50, 50);
        ctx.beginPath();
        ctx.rect(150, 150, 200, 200);
        ctx.clip();
        ctx.clearRect(0, 0, 300, 300)
    },
    title: 'clear a rect that intersects clipping region'
}