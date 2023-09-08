<script setup lang="ts">
import { ref, computed, inject, watchEffect, onMounted } from 'vue'
import ExamplesListItem from './ExamplesListItem.vue'
import type { ExamplesStore } from './examples-store'
import type { ExamplesNavigator } from './examples-navigator'
import { examplesStoreInjectionKey, examplesNavigatorInjectionKey } from './constants'

const { examples, selected, selectExample } = inject(examplesStoreInjectionKey) as ExamplesStore
const { previous, next } = inject(examplesNavigatorInjectionKey) as ExamplesNavigator
const selectValue = computed({
    get(): string{
        const selectedValue = selected.value;
        return selectedValue || '';
    },
    set(value: string){
        selectExample(value);
    }
})
const details = ref<HTMLDetailsElement | null>(null)
const useCases = computed(() => examples.value.filter(e => e.description.kind === 'use-case'))
const testCases = computed(() => examples.value.filter(e => e.description.kind === 'test-case'))
const testCaseSelected = computed(() => testCases.value.some(c => c.id === selected.value))
const testCasesVisible = computed(() => !!details.value && details.value.getAttribute('open') === '')

watchEffect(() => {
    if(details.value && testCaseSelected.value){
        details.value.setAttribute('open', '')
    }
})
onMounted(() => {
    next.subscribe(() => selectNext())
    previous.subscribe(() => selectPrevious())
})

function selectNext(){
    const useCasesIndex = useCases.value.findIndex(c => c.id === selected.value);
    if(useCasesIndex > -1){
        if(useCasesIndex < useCases.value.length - 1){
            selectExample(useCases.value[useCasesIndex + 1].id)
        }else if(testCases.value.length > 0){
            selectExample(testCases.value[0].id)
        }
        return;
    }
    const testCasesIndex = testCases.value.findIndex(c => c.id === selected.value);
    if(testCasesIndex > -1 && testCasesIndex < testCases.value.length - 1){
        selectExample(testCases.value[testCasesIndex + 1].id)
    }
}

function selectPrevious(){
    const useCasesIndex = useCases.value.findIndex(c => c.id === selected.value);
    if(useCasesIndex > 0){
        selectExample(useCases.value[useCasesIndex - 1].id)
        return;
    }
    const testCasesIndex = testCases.value.findIndex(c => c.id === selected.value);
    if(testCasesIndex > 0){
        selectExample(testCases.value[testCasesIndex - 1].id)
    }else if(testCasesIndex === 0 && useCases.value.length > 0){
        selectExample(useCases.value[useCases.value.length - 1].id)
    }
}
</script>

<template>
    <div class="examples-list">
        <ul>
            <examples-list-item 
                v-for="example in useCases"
                :example="example"
                :selected="selected === example.id"
                :key="example.id"
                :visible="true"
                @selected="() => selectExample(example.id)"/>
            
        </ul>
        <details ref="details">
            <summary>Test cases</summary>
            <ul>
                <examples-list-item 
                    v-for="example in testCases"
                    :example="example"
                    :selected="selected === example.id"
                    :key="example.id"
                    :visible="testCasesVisible"
                    @selected="() => selectExample(example.id)"/>
            </ul>
        </details>
        <select v-model="selectValue">
            <option value="" :disabled="!!selected">select example</option>
            <option v-for="example in examples" :value="example.id">{{example.description.title}}</option>
        </select>
    </div>
</template>

<style scoped lang="css">
.examples-list{
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
}
.examples-list ul{
    list-style-type: none;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 40px;
}
.examples-list details{
    padding-inline-start: calc(40px - 1em);
}
.examples-list select{
    display: none;
    width: 100%;
}

@media(max-width: 640px){
    .examples-list ul{
        display: none;
    }
    .examples-list details{
        display: none;
    }
    .examples-list select{
        display: initial;
    }
}
</style>