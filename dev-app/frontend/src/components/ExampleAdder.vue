<script setup lang="ts">
import { inject, ref } from 'vue'
import type { ExamplesStore } from '../examples-store'
import { examplesStoreInjectionKey } from '../constants'

const title = ref<string>('');
const busy = ref<boolean>(false)
const { createExample } = inject(examplesStoreInjectionKey) as ExamplesStore

async function submit(): Promise<void>{
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
    <v-container>
        <v-form @submit.prevent="submit" :disabled="busy">
            <v-text-field label="name" v-model="title"/>
            <v-btn 
                rounded="xl"
                block
                type="submit">
                <v-icon icon="mdi-plus"/>
            </v-btn>
        </v-form>
    </v-container>
</template>
