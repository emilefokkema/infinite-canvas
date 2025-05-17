import { Dimension } from "../dimension";

export function throwNoTopLeftLocationError(
    horizontal: Dimension,
    vertical: Dimension
): never{
    throw new Error(`The starting coordinates provided (${horizontal.start} and ${vertical.start}) do not determine a direction.`)
}