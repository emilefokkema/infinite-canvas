export default {
    code(ctx){
        ctx.lineWidth = 40;
        ctx.strokeRect(30, 30, 60, 60)
        ctx.clearRect(20, 20, 80, 80)
    },
    title: "stroke rect with big line width and clear rect inside stroked line"
}