import puppeteer from "puppeteer";

interface TouchPoint{
    x: number;
    y: number;
    id: number;
}
export class Touch{
    constructor(
        public readonly move: (x: number, y: number) => Promise<void>,
        public readonly end: () => Promise<void>
    ) {
    }

}
export class TouchCollection{
    private touchPoints: TouchPoint[] = [];
    constructor(private readonly session: puppeteer.CDPSession) {
    }
    private getNewTouchId(): number{
        if(this.touchPoints.length === 0){
            return 0;
        }
        for(let i = 0; i < this.touchPoints.length; i++){
            if(!this.touchPoints.some(p => p.id === i)){
                return i;
            }
        }
        return Math.max(...this.touchPoints.map(p => p.id)) + 1;
    }
    public async start(x: number, y: number): Promise<Touch>{
        const touchPoint: TouchPoint = {x, y, id: this.getNewTouchId()};
        this.touchPoints.push(touchPoint);
        await this.session.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [touchPoint]
        });
        return new Touch(async (newX: number, newY: number) => {
            touchPoint.x = newX;
            touchPoint.y = newY;
            await this.session.send('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [touchPoint]
            })
        }, async () => {
            const index = this.touchPoints.indexOf(touchPoint);
            if(index === -1){
                return;
            }
            this.touchPoints.splice(index, 1);
            await this.session.send('Input.dispatchTouchEvent', {
                type: 'touchEnd',
                touchPoints: [touchPoint]
            })
        })
    }
}
