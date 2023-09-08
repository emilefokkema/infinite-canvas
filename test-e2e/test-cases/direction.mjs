export default {
    code(ctx){
        ctx.font = '48px "Verdana"';
        ctx.fillText("Hi!", 150, 50);
        ctx.direction = "rtl";
        ctx.fillText("Hi!", 150, 130);
    },
    title: "direction"
}