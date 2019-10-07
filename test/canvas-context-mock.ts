export class CanvasContextMock{
    public mock: any;
    private logs: string[];
    constructor(){
        const self: CanvasContextMock = this;
        this.logs = [];
        const methods: string[] = [
            "setLineDash",
            "clearRect",
            "fillRect",
            "setTransform",
            "transform",
            "beginPath",
            "moveTo",
            "lineTo",
            "closePath",
            "fill",
            "save",
            "restore",
            "stroke"
        ];
        const setters: string[] = [
            "fillStyle",
            "strokeStyle",
            "lineWidth",
            "lineDashOffset"
        ];
        this.mock = {};
        for(const methodName of methods){
            this.mock[methodName] = function(...args: any){
                self.logMethod(methodName, ...args);
            };
        }
        for(const setter of setters){
            Object.defineProperty(this.mock, setter, {
                set:function(value: any){
                    self.logSetter(setter, value);
                },
                configurable:true
            });
        }
    }
    private logMethod(methodName: string, ...args: any){
        this.logs.push(`context.${methodName}(${args.map((x: any) => JSON.stringify(x)).join(',')})`);
    }
    private logSetter(propertyName: string, value: any){
        this.logs.push(`context.${propertyName} = ${JSON.stringify(value)}`)
    }
    public clear(){
        this.logs = [];
    }
    public getLog(): string[]{
        return this.logs.slice();
    }
}