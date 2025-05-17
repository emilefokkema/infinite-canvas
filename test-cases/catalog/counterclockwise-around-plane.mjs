export default {
    code(ctx){
        ctx.beginPath();
        ctx.moveToInfinityInDirection(1, 0);
        ctx.lineToInfinityInDirection(-1, -1);
        ctx.lineToInfinityInDirection(-1, 1);
        ctx.rect(150, 150, 100, 100);
        ctx.fill();
    },
    finiteCode(ctx){
        ctx.beginPath();
        ctx.rect(500, -100, -600, 600);
        ctx.rect(150, 150, 100, 100);
        ctx.fill();
    },
    title: 'counterclockwise around plane'
}