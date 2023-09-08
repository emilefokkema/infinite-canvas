export default {
    code:function(ctx){
        ctx.lineWidth = 4;
        ctx.shadowOffsetX = -40;
        ctx.shadowOffsetY = -40;
        ctx.shadowColor = '#999'
        ctx.fillStyle = 'rgba(255, 0, 0, .2)'
        ctx.filter = 'drop-shadow(20px -20px 2px #00f)'
        ctx.beginPath();
        ctx.arc(150, 150, 50, Math.PI / 2, 3 * Math.PI / 2)
        ctx.lineToInfinityInDirection(1, 0)
        ctx.lineTo(100, 350)
        ctx.lineToInfinityInDirection(-1, 0)
        ctx.fill()
        ctx.stroke()
    },
    finiteCode(ctx){
        ctx.lineWidth = 4;
        ctx.shadowOffsetX = -40;
        ctx.shadowOffsetY = -40;
        ctx.shadowColor = '#999'
        ctx.fillStyle = 'rgba(255, 0, 0, .2)'
        ctx.filter = 'drop-shadow(20px -20px 2px #00f)'
        ctx.beginPath();
        ctx.arc(150, 150, 50, Math.PI / 2, 3 * Math.PI / 2)
        ctx.lineTo(500, 100)
        ctx.lineTo(500, 350)
        ctx.lineTo(100, 350)
        ctx.lineTo(-100, 350)
        ctx.lineTo(-100, 200)
        ctx.fill()
        ctx.stroke()
    },
    title: "use shadow and draw path to infinity"
}