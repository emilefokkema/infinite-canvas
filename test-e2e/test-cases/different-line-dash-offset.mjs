export default {
    code:function(ctx){
        ctx.setLineDash([4, 16]);

        // Dashed line with no offset
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(300, 50);
        ctx.stroke();

        // Dashed line with offset of 4
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineDashOffset = 4;
        ctx.moveTo(0, 100);
        ctx.lineTo(300, 100);
        ctx.stroke();
    },
    title: "set different lineDashOffset"
}