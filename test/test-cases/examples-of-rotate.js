export default {
    code:function(ctx){
        // left rectangles, rotate from canvas origin
        ctx.save();
        // blue rect
        ctx.fillStyle = '#0095DD';
        ctx.fillRect(30, 30, 100, 100); 
        ctx.rotate((Math.PI / 180) * 25);
        // grey rect
        ctx.fillStyle = '#4D4E53';
        ctx.fillRect(30, 30, 100, 100);
        ctx.restore();

        // right rectangles, rotate from rectangle center
        // draw blue rect
        ctx.fillStyle = '#0095DD';
        ctx.fillRect(150, 30, 100, 100);  
        
        ctx.translate(200, 80); // translate to rectangle center 
                                // x = x + 0.5 * width
                                // y = y + 0.5 * height
        ctx.rotate((Math.PI / 180) * 25); // rotate
        ctx.translate(-200, -80); // translate back
        
        // draw grey rect
        ctx.fillStyle = '#4D4E53';
        ctx.fillRect(150, 30, 100, 100);
    },
    title: "examples of rotate"
}