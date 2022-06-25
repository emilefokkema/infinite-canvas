export default {
    code: function(ctx){
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.rect(0,0,50,50);
        ctx.fillRect(50,50,50,50);
        ctx.fill();
    },
    title: "build a path, fill a rect and then fill the path"
}