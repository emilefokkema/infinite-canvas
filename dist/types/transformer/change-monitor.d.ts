import { Event } from "../custom-events/event";
export declare class ChangeMonitor<TValue> {
    private readonly setNewValue;
    private readonly timeoutInMs;
    private currentTimeout;
    private _changing;
    private _firstChange;
    private _subsequentChange;
    private _changeEnd;
    constructor(setNewValue: (value: TValue) => void, timeoutInMs: number);
    get firstChange(): Event<void>;
    get subsequentChange(): Event<void>;
    get changeEnd(): Event<void>;
    get changing(): boolean;
    private refreshTimeout;
    setValue(value: TValue): void;
}
