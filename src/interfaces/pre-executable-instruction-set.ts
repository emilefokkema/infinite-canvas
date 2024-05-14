import { StateChangingInstructionSet } from "./state-changing-instruction-set";
import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";
import { PathInfinityProvider } from "./path-infinity-provider";

export interface PreExecutableInstructionSet extends StateChangingInstructionSet{
    makeExecutable(infinityProvider: PathInfinityProvider): ExecutableStateChangingInstructionSet
}