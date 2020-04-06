import { StateChangingInstructionSet } from "./state-changing-instruction-set";
import { PathInfinityProvider } from "./path-infinity-provider";

export interface CopyableInstructionSet extends StateChangingInstructionSet{
    copy(pathInfinityProvider: PathInfinityProvider): CopyableInstructionSet;
}