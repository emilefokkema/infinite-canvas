export default {
    code: function(ctx){
        ctx.fillRect(50, 50, 50, 50);
        ctx.fillRect(200, 200, 100, 100);
        ctx.beginPath();
        ctx.rect(150, 150, 200, 200);
        ctx.clip();
        ctx.clearRect(0, 0, 400, 250)
    },
    title: 'clear a rect that intersects clipping region and drawing'
}