export default {
    code: function(ctx){
        ctx.translate(200, 0);
        ctx.fillRect(0, 0, 100, 100);
        ctx.clearRect(50, 0, 300, 300);
    },
    title: "translate, fill a rect and clear part of it"
}