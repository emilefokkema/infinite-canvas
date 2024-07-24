import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './components/App.vue'
import { 
    examplesStoreInjectionKey,
    examplesRouterInjectionKey,
    appThemeInjectionKey} from './constants';
import { createExamplesStore } from './examples-store';
import { createExamplesRouter } from './examples-router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createAppTheme } from './app-theme'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    },
    icons: {
        defaultSet: 'mdi',

      },
})
const currentlyDark = true
const app = createApp(App)
const examplesRouter = createExamplesRouter();
const store = createExamplesStore(examplesRouter);
app.provide(examplesRouterInjectionKey, examplesRouter);
app.provide(examplesStoreInjectionKey, store)
app.provide(appThemeInjectionKey, createAppTheme(currentlyDark))
app.use(vuetify)
app.mount('#app')