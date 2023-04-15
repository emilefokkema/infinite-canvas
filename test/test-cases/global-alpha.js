export default {
    code(ctx){
        ctx.globalAlpha = 0.5;

        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, 100, 100);

        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 100, 100);
    },
    title: "globalAlpha"
}