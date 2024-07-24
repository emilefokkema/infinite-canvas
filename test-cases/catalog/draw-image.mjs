export default {
    code: function(ctx){
        var image = new Image(300, 227);
        image.addEventListener('load', e => {
            ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
        });
        image.src = "/static/rhino.jpg";
    },
    title: "draw image"
}