import type { InjectionKey } from "vue";
import type { ExamplesStore } from './examples-store'
import type { ExamplesRouter } from './examples-router'
import type { AppTheme } from "./app-theme";

export const examplesStoreInjectionKey: InjectionKey<ExamplesStore> = Symbol();
export const examplesRouterInjectionKey: InjectionKey<ExamplesRouter> = Symbol();
export const appThemeInjectionKey: InjectionKey<AppTheme> = Symbol();