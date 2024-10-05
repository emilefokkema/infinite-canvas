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
            ctx.strokeStyle = pattern;
            ctx.lineWidth = 3;
            ctx.setLineDash([12, 2]);
            ctx.font = '100px "Verdana"';
            ctx.strokeRect(10, 10, 90, 90);
            ctx.beginPath();
            ctx.moveTo(20, 20);
            ctx.lineTo(100, 0);
            ctx.lineTo(30, 100);
            ctx.strokeText("text", 30, 90);
            ctx.stroke();
        });
    },
    title: "using a pattern and a line dash, stroke a rect, make a path, stroke text and then stroke the current path",
    dependsOnEnvironments: ['gitpod']
}