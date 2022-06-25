export default {
    code:function(ctx){
        ctx.lineWidth = 5;
        ctx.transform(1, .2, .8, 1, 0, 0);
        ctx.strokeRect(0, 0, 100, 100);
    },
    title: "set a transform and stroke a rect"
}