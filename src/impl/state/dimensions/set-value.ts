import { MinimalInstruction } from "../../instructions/instruction";

export class SetValue<K extends keyof CanvasRenderingContext2D> implements MinimalInstruction{
    public constructor(private readonly propName: K, private readonly value: CanvasRenderingContext2D[K]){}

    public execute(context: CanvasRenderingContext2D): void {
        context[this.propName] = this.value;
    }
}