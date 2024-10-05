<script setup lang="ts">
import { ref, inject, onMounted, computed } from 'vue'
import { examplesStoreInjectionKey, examplesRouterInjectionKey } from '../constants'
import type { ExamplesStore } from '../examples-store'
import ThemeSwitch from './ThemeSwitch.vue'
import NewExampleAdder from './ExampleAdder.vue'
import NewExamplesList from './ExamplesList.vue'
import ExampleIframe from './ExampleIframe.vue'
import type { ExamplesRouter } from '../examples-router'
import { useCurrentExampleUrl } from '../current-example-url'
import { useAppTheme } from '../app-theme'
import { useDarkenedUrl } from '../../../../utils/dark-theme/frontend/vue-plugin'

const { refresh, selected, examples } = inject(examplesStoreInjectionKey) as ExamplesStore;
const { initialize } = inject(examplesRouterInjectionKey) as ExamplesRouter;
const {dark} = useAppTheme()
const url = useCurrentExampleUrl()
const darkUrl = useDarkenedUrl({viteContentType: 'served', url, dark})

const drawer = ref(true)
const selectedExampleName = computed(() => {
    const selectedExample = examples.value.find(e => e.id === selected.value)
    return selectedExample?.description.title
})

onMounted(() => {
    refresh();
    initialize()
})
</script>

<template>
    <v-app>
        <v-navigation-drawer v-model="drawer">
            <new-examples-list></new-examples-list>
            <template #append>
                <new-example-adder />
            </template>
        </v-navigation-drawer>
        <v-app-bar>
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            </template>
            <v-app-bar-title>
                {{ selectedExampleName }}
                
            </v-app-bar-title>
            <template v-slot:append>
                <a :href="darkUrl" target="_blank">
                    <v-icon color="grey-darken-2" icon="mdi-open-in-new"/>
                </a>  
                <theme-switch></theme-switch>
            </template>
        </v-app-bar>
        <v-main>
            <example-iframe />
        </v-main>
    </v-app>
    
</template>

