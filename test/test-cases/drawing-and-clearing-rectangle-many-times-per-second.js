export default {
    code: function(ctx){
        let offset = 0;

        function draw() {
            ctx.clearRect(0, 0, 200, 200);
            ctx.setLineDash([4, 2]);
            ctx.lineDashOffset = -offset;
            ctx.strokeRect(10, 10, 100, 100);
        }

        function march() {
            offset++;
            if (offset > 16) {
                offset = 0;
            }
            draw();
            setTimeout(march, 20);
        }

        march();
    },
    title: "drawing and clearing a rectangle many times per second"
}