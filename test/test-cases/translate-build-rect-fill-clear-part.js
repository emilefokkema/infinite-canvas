export default {
    code: function(ctx){
        ctx.translate(200, 0);
        ctx.beginPath();
        ctx.rect(0, 0, 100, 100);
        ctx.fill();
        ctx.clearRect(50, 0, 300, 300);
    },
    title: "translate, build a rect, fill it and clear part of it"
}