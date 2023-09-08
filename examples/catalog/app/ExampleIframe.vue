<script setup lang="ts">
import { watchEffect, inject, ref } from 'vue'
import { examplesStoreInjectionKey } from './constants'
import type { ExamplesStore } from './examples-store'
import { getExampleUrl } from './example-url'

const { examples, selected } = inject(examplesStoreInjectionKey) as ExamplesStore
const iframe = ref<HTMLIFrameElement>();

watchEffect(() => {
    const iFrameValue = iframe.value;
    if(!iFrameValue){
        return;
    }
    const selectedValue = selected.value;
    if(!selectedValue){
        return;
    }
    const example = examples.value.find(e => e.id === selectedValue);
    if(!example){
        return;
    }
    iFrameValue.src = getExampleUrl(example);
})
</script>
<template>
    <div class="iframe-container">
        <iframe ref="iframe"></iframe>
    </div>
</template>

<style lang="css" scoped>
.iframe-container{
    height: 100%;
}
iframe{
    width: 100%;
    height: 100%;
    border: none;
}
</style>