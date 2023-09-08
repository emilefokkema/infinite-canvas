export default {
    code:function(ctx){
        ctx.fillStyle = '#ff6';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.rect(25, 25, 50, 50);
        ctx.fill();
        ctx.clearRect(10, 10, 80, 80);
        ctx.fill();
    },
    title: "build path, fill it, clear a rect and then fill the path again"
}