import { createApp } from 'vue'
import App from './App.vue'
import { examplesStoreInjectionKey, examplesRouterInjectionKey, examplesNavigatorInjectionKey } from './constants';
import { createExamplesStore } from './examples-store';
import { createExamplesRouter } from './examples-router'
import { createExamplesNavigator } from './examples-navigator'
import './main.css'

const app = createApp(App)
const examplesRouter = createExamplesRouter();
app.provide(examplesRouterInjectionKey, examplesRouter);
app.provide(examplesNavigatorInjectionKey, createExamplesNavigator())
app.provide(examplesStoreInjectionKey, createExamplesStore(examplesRouter))
app.mount('#app')