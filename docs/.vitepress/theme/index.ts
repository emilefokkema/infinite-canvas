// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import MyLayout from './my-layout.vue';
import type { EnhanceAppContext } from 'vitepress'
import Example from './example.vue';
import { data } from '../shared/examples.data';
import { exampleDataInjectionKey, exampleRegistryInjectionKey } from './constants';
import { createExampleRegistry } from './example-registry'
import './style.css'

export default {
  extends: Theme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    // ...
    app.component('inf-example', Example);
    app.provide(exampleDataInjectionKey, data);
    app.provide(exampleRegistryInjectionKey, createExampleRegistry())
  }
}
