export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.rect(10, 10, 100, 100);
        ctx.lineWidth = 6;
        ctx.transform(.2, 0, 0, 1, 0, 0);
        ctx.stroke();
    },
    title: "build a path, set a transform and stroke"
}