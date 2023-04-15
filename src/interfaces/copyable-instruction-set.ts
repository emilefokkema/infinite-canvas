import { StateChangingInstructionSet } from "./state-changing-instruction-set";
import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";
import { PathInfinityProvider } from "./path-infinity-provider";

export interface CopyableInstructionSet extends StateChangingInstructionSet{
    copy(): CopyableInstructionSet
    makeExecutable(infinityProvider: PathInfinityProvider): ExecutableStateChangingInstructionSet
}