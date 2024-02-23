import type { InjectionKey } from "vue";
import type { ExampleProject } from '../../../examples/shared/examples';
import { ExampleInfiniteCanvasRegistry } from "./infinite-canvas-example/example-infinite-canvas-registry";

export const exampleDataInjectionKey: InjectionKey<ExampleProject[]> = Symbol();
export const exampleInfiniteCanvasRegistryInjectionKey: InjectionKey<ExampleInfiniteCanvasRegistry> = Symbol();