<script setup lang="ts">
import { inject, ref } from 'vue'
import type { ExamplesStore } from './examples-store'
import { examplesStoreInjectionKey } from './constants'

const title = ref<string>('');
const busy = ref<boolean>(false)
const { createExample } = inject(examplesStoreInjectionKey) as ExamplesStore

async function addClickHandler(): Promise<void>{
    if(!title.value){
        return;
    }
    try{
        busy.value = true;
        await createExample({title: title.value})
    }finally{
        busy.value = false;
        title.value = '';
    }
}
</script>

<template>
    <div>
        <div class="container">
            <button :disabled="busy" @click="addClickHandler">Add</button><input :disabled="busy" v-model="title" type="text"/>
        </div>
    </div>
    
</template>

<style lang="css" scoped>
.container{
    display: flex;
    flex-direction: row-reverse;
}
input{
    margin-right: .5em;
}
</style>