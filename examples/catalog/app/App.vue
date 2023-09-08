<script setup lang="ts">
import { computed, onMounted, inject } from 'vue'
import ExamplesList from './ExamplesList.vue'
import ExampleIframe from './ExampleIframe.vue'
import ExampleAdder from './ExampleAdder.vue';
import ExampleLink from './ExampleLink.vue'
import type { ExamplesStore } from './examples-store'
import type { ExamplesRouter } from './examples-router'
import { examplesStoreInjectionKey, examplesRouterInjectionKey } from './constants'
import { getExampleUrl } from './example-url'

const { examples, selected, refresh } = inject(examplesStoreInjectionKey) as ExamplesStore;
const { initialize } = inject(examplesRouterInjectionKey) as ExamplesRouter;
const exampleUrl = computed(() => {
    const selectedValue = selected.value;
    if(!selectedValue){
        return '';
    }
    const example = examples.value.find(e => e.id === selectedValue);
    if(!example){
        return;
    }
    return getExampleUrl(example);
})

onMounted(() => {
    initialize();
    refresh();
})
</script>

<template>
    <div class="container">
        <div class="controls-container-layout controls-container controls-container-beginning">
            <div class="controls-container-layout controls-container-beginning controls-beginning">
                <div class="list-container">
                    <examples-list />
                </div>
                <div class="link-container">
                    <example-link v-if="!!exampleUrl" :url="exampleUrl"/>
                </div>
            </div>
            <div class="controls-container-layout controls-container-end">
                <div class="example-adder-container">
                    <example-adder />
                </div>
            </div>
        </div>
        <div class="iframe-container">
            <example-iframe />
        </div>
    </div>
    
</template>

<style scoped lang="css">
.container{
    display: flex;
    flex-direction: column;
    justify-content: start;
    position: absolute;
    width: 100%;
    height: 100%;
}
.iframe-container{
    order: 1;
    flex: 1;
}
.list-container{
    width: 80%;
}
.controls-container-beginning{
    flex-direction: row;
    order: 0;
}
.controls-container-end{
    flex: 1;
    flex-direction: row-reverse;
}
.controls-container-layout{
    display:flex;
}
.controls-container{
    order: 0;
    width: 100%;
    border-bottom: 1px solid #000;
    background-color: #eee;
    padding: 10px;
}
.link-container{
    margin-left: 8px;
}
.example-adder-container{
    display: none;
}
@media(min-width: 640px){
    .container{
        flex-direction: row;
    }
    .controls-container-beginning{
        flex-direction: column;
    }
    .controls-beginning{
        height: 80%;
    }
    .controls-container-end{
        flex-direction: column-reverse;
    }
    .list-container{
        height: 100%;
        width: auto;
    }
    .controls-container{
        width: 300px;
        border-right-width: 1px;
        border-bottom: none;
        border-right: 1px solid #000;
    }
    .link-container{
        display: none;
    }
    .example-adder-container{
        display: initial;
    }
}
</style>