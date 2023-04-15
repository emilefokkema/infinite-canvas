export default {
    code(ctx){
        ctx.font = "48px serif";
        ctx.fillText("Hi!", 150, 50);
        ctx.direction = "rtl";
        ctx.fillText("Hi!", 150, 130);
    },
    title: "direction"
}