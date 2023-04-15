export default {
    code: function(ctx){
        var width = 60;
        var height = 60;
        var centerX = 5;
        var centerY = 5;
        var radiusSq = 25;
        var array = new Uint8ClampedArray(4 * width * height);
        for(var j=0;j<height;j++){
            for(var i=0;i<width;i++){
                var dx = i - centerX;
                var dy = j - centerY;
                var index = 4 * j * width + 4 * i;
                var inside = dx * dx + dy * dy < radiusSq;
                array[index] = inside ? 255:0;
                array[index + 3] = 255;
            }
        }
        var imageData = new ImageData(array, width);
        ctx.translate(80, 30);
        ctx.filter = 'brightness(60%)'
        ctx.globalAlpha = .5
        ctx.shadowColor = '#00f'
        ctx.shadowOffsetX = 20
        ctx.shadowBlur = 4
        ctx.fillStyle = "#f00";
        ctx.fillRect(0, 0, 40, 40);
        ctx.putImageData(imageData, 20, 20);
    },
    title: "put image data"
}