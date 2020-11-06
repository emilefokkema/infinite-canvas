import {EventDispatcher} from "../custom-events/event-dispatcher";
import { Event } from "../custom-events/event";

export class ChangeMonitor<TValue>{
    private currentTimeout: any;
    private _changing: boolean;
    private _firstChange: EventDispatcher<void>;
    private _subsequentChange: EventDispatcher<void>;
    private _changeEnd: EventDispatcher<void>;
    constructor(private readonly setNewValue: (value: TValue) => void, private readonly timeoutInMs: number) {
        this._changing = false;
        this._firstChange = new EventDispatcher<void>();
        this._subsequentChange = new EventDispatcher<void>();
        this._changeEnd = new EventDispatcher<void>();
    }
    public get firstChange(): Event<void>{return this._firstChange;}
    public get subsequentChange(): Event<void>{return this._subsequentChange;}
    public get changeEnd(): Event<void>{return this._changeEnd;}
    public get changing(): boolean{return this._changing;}
    private refreshTimeout(): void{
        if(this.currentTimeout !== undefined){
            clearTimeout(this.currentTimeout);
        }
        this.currentTimeout = setTimeout(() => {
            this._changing = false;
            this.currentTimeout = undefined;
            this._changeEnd.dispatchEvent();
        }, this.timeoutInMs);
    }
    public setValue(value: TValue): void{
        this.setNewValue(value);
        if(this._changing){
            this._subsequentChange.dispatchEvent();
        }else{
            this._changing = true;
            this._firstChange.dispatchEvent();
        }
        this.refreshTimeout();
    }
}
