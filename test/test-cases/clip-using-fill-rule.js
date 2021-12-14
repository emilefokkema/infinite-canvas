export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.rect(10, 10, 100, 100);
        ctx.rect(30, 30, 30, 30);
        ctx.clip("evenodd");
        ctx.beginPath();
        ctx.arc(60, 60, 50 * (2 + Math.sqrt(2)) / 3, 0, 2 * Math.PI);
        ctx.fill();
    },
    title: "clip using a fill rule",
    maxDifference: 124816
}