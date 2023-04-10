export default {
    code(ctx){
        ctx.shadowOffsetX = 80;
        ctx.shadowOffsetY = 80;
        ctx.shadowColor = '#444'
        ctx.shadowBlur = 5;
        ctx.fillRect(20,  20, 40, 40)
        ctx.clearRect(0, 0, 80, 80)
    },
    title: "use shadow, fill rect, clear rect clearing rect but not shadow"
}