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
        dependencies: {'ef-infinite-canvas': '^0.6.2'}
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
                <path fill="#1374EF" d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"></path>
            </svg>
        </div>
        <div class="warning" v-else>could not find example files!</div>
    </div>
    
    
</template>

<style lang="css" scoped>
.stackblitz-button{
    display: inline-block;
    color: #1374EF;
    opacity: .7;
    cursor: pointer;
}
.stackblitz-button:hover{
    opacity: 1;
}
.warning{
    color: #ff000044;
}
</style>