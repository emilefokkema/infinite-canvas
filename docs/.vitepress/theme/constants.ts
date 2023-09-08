import type { InjectionKey } from "vue";
import type { ExampleProject } from '../../../examples/shared/examples';
import type { ExampleRegistry } from "./example-registry";

export const exampleDataInjectionKey: InjectionKey<ExampleProject[]> = Symbol();
export const exampleRegistryInjectionKey: InjectionKey<ExampleRegistry> = Symbol();