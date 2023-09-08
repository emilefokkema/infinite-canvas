import type { InjectionKey } from "vue";
import type { ExamplesStore } from './examples-store'
import type { ExamplesRouter } from './examples-router'
import type { ExamplesNavigator } from './examples-navigator'

export const examplesStoreInjectionKey: InjectionKey<ExamplesStore> = Symbol();
export const examplesRouterInjectionKey: InjectionKey<ExamplesRouter> = Symbol();
export const examplesNavigatorInjectionKey: InjectionKey<ExamplesNavigator> = Symbol();
export const linkText = '\u{1f517}'