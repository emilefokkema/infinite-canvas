// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import MyLayout from './my-layout.vue';
import type { EnhanceAppContext } from 'vitepress'
import Example from './example.vue'
import { data } from '../shared/examples.data';
import { exampleDataInjectionKey, exampleInfiniteCanvasRegistryInjectionKey } from './constants';
import './style.css'
import { ExampleInfiniteCanvasRegistry } from './infinite-canvas-example/example-infinite-canvas-registry';

export default {
  extends: Theme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }: EnhanceAppContext) {
    // ...
    app.component('inf-example', Example);
    app.provide(exampleDataInjectionKey, data);
    app.provide(exampleInfiniteCanvasRegistryInjectionKey, ExampleInfiniteCanvasRegistry.create())
  }
}
