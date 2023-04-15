export default {
    code: function(ctx){
        var length = 20;
        var array = new Uint8ClampedArray(4 * length * length);
        for(var j=0;j<length;j++){
            for(var i=0;i<length;i++){
                var dx = i - length / 2;
                var dy = j - length / 2;
                var index = 4 * j * length + 4 * i;
                var inside = dx * dx + dy * dy < length * length / 4;
                array[index] = inside ? 255:0;
                array[index + 3] = 255;
            }
        }
        var imageData = new ImageData(array, length);
        createImageBitmap(imageData).then(function(bitmap){
            var pattern = ctx.createPattern(bitmap, 'repeat');
            ctx.translate(17, 17);
            ctx.strokeStyle = pattern;
            ctx.strokeRect(0, 0, 100, 100);
        });
    },
    title: "stroke rectangle with a pattern"
}