import { PreventableDefault } from "./preventable-default";

export interface MappedEventPreventableDefault extends PreventableDefault{
    readonly nativeDefaultPrevented: boolean;
    readonly nativeCancelable: boolean;
    preventDefault(preventNativeDefault?: boolean): void;
}