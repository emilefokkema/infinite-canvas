export default {
    code: function(ctx){
        ctx.beginPath();
        ctx.rect(10, 10, 50, 50);
        ctx.save();
        ctx.clip();
        ctx.fillRect(0, 0, 20, 20);
        ctx.stroke();
    },
    title: "make a path, save state, clip, fill a rect and then stroke the path"
}