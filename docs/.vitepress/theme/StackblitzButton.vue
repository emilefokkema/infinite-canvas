<script setup lang="ts">
import sdk from '@stackblitz/sdk'
import { onMounted, inject, shallowRef  } from 'vue'
import { exampleDataInjectionKey } from './constants'
import type { ExampleProject } from '../../../examples/shared/examples';
const props = defineProps({
    exampleId: {
        type: String,
        required: true
    }
})

const data = inject(exampleDataInjectionKey);
const project = shallowRef<ExampleProject | null>(null);

function openProjectInStackBlitz(): void{
    const projectValue = project.value;
    if(!projectValue){
        return;
    }
    const packageJson = {
        name: projectValue.id,
        version: "0.0.0",
        private: true,
        dependencies: {'ef-infinite-canvas': '^---VERSION---'}
    }
    sdk.openProject({
        title: projectValue.title,
        template: 'javascript',
        files: {
            ...projectValue.files,
            'package.json': JSON.stringify(packageJson, null, 2)
        },
        dependencies: packageJson.dependencies
    })
}
onMounted(() => {
    if(!data){
        return;
    }
    project.value = data.find((p: ExampleProject) => p.id === props.exampleId) || null;
})
</script>

<template>
    <div>
        <div v-if="!!project" class="stackblitz-button" @click="openProjectInStackBlitz">
            <img src="/stackblitz.svg"/>
        </div>
        <div class="warning" v-else>could not find example files!</div>
    </div>
    
    
</template>

<style lang="css" scoped>
.stackblitz-button{
    display: inline-block;
    cursor: pointer;
}
.warning{
    color: #ff000044;
}
</style>