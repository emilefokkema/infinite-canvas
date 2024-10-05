export default {
    code: (ctx) => {
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineTo(100, 100);
        ctx.stroke();
    },
    title: "line cap"
};