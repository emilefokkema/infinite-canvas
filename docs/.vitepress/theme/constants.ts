import type { InjectionKey } from "vue";
import type { ExampleProject } from '../../../examples/shared/examples';

export const exampleDataInjectionKey: InjectionKey<ExampleProject[]> = Symbol();