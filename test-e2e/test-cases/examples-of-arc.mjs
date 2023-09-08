export default {
    code: function(ctx){
        // Draw shapes
        for (let i = 0; i <= 3; i++) {
            for (let j = 0; j <= 2; j++) {
                ctx.beginPath();
                let x             = 25 + j * 50;                 // x coordinate
                let y             = 25 + i * 50;                 // y coordinate
                let radius        = 20;                          // Arc radius
                let startAngle    = 0;                           // Starting point on circle
                let endAngle      = Math.PI + (Math.PI * j) / 2; // End point on circle
                let anticlockwise = i % 2 == 1;                  // Draw anticlockwise

                ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);

                if (i > 1) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
            }
        }
    },
    title: "examples of arc"
}