export default {
    code(ctx){
        ctx.globalCompositeOperation = "xor";

        ctx.fillStyle = "blue";
        ctx.fillRect(10, 10, 100, 100);

        ctx.fillStyle = "red";
        ctx.fillRect(50, 50, 100, 100);
    },
    title: "globalCompositeOperation"
}