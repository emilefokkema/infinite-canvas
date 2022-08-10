import puppeteer from "puppeteer";

interface TouchPoint{
    x: number;
    y: number;
}
export class Touch{
    constructor(
        public readonly move: (x: number, y: number) => Promise<void>,
        public readonly end: () => Promise<void>
    ) {
    }

}
export class TouchCollection{
    private touchPoints: TouchPoint[] = [] ;
    constructor(private readonly session: puppeteer.CDPSession) {
    }
    public async start(x: number, y: number): Promise<Touch>{
        const touchPoint: TouchPoint = {x, y};
        this.touchPoints.push(touchPoint);
        await this.session.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: this.touchPoints
        });
        return new Touch(async (newX: number, newY: number) => {
            touchPoint.x = newX;
            touchPoint.y = newY;
            await this.session.send('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: this.touchPoints
            })
        }, async () => {
            const index: number = this.touchPoints.indexOf(touchPoint);
            if(index === -1){
                return;
            }
            this.touchPoints.splice(index, 1);
            await this.session.send('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: this.touchPoints
            })
        })
    }
}
