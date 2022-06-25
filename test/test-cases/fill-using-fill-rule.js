export default {
    code:function(ctx){
        ctx.beginPath();
        ctx.rect(10, 10, 100, 100);
        ctx.rect(30, 30, 30, 30);
        ctx.fill("evenodd");
    },
    title: "fill using a fill rule"
}