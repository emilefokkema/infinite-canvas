export default {
    code:function(ctx){
        ctx.strokeStyle = 'green';
        ctx.strokeRect(50, 40, 80, 80);
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 10, 160, 100);
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 20, 100, 160);
    },
    title: "stroke rectangles with different lineWidth"
}