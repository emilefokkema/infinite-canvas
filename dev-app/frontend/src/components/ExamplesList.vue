<script setup lang="ts">
import { inject, computed } from 'vue'
import { examplesStoreInjectionKey } from '../constants'
import type { DisplayableExample, ExamplesStore } from '../examples-store'
import { splitOnWordBoundary } from '../split-on-word-boundary';
const { examples, selected, selectExample } = inject(examplesStoreInjectionKey) as ExamplesStore

interface ExampleListItemData{
    id: string
    title: string
    subtitle: string
}

function createItemData(example: DisplayableExample): ExampleListItemData{
    const [title, subtitle] = splitOnWordBoundary(example.description.title, 20)
    return {
        id: example.id,
        title,
        subtitle
    }
}

const useCases = computed(() => examples.value.filter(e => e.description.kind === 'use-case').map(createItemData))
const testCases = computed(() => examples.value.filter(e => e.description.kind === 'test-case').map(createItemData))
</script>

<template>
    <v-list :activatable="false">
        <v-list-subheader>Use cases</v-list-subheader>
        <v-list-item 
            v-for="useCase in useCases"
            :key="useCase.id"
            :value="useCase.id"
            color="primary"
            lines="three"
            :active="selected == useCase.id"
            @click="() => selectExample(useCase.id)"
            >
            <template #title>
                {{useCase.title}}
            </template>
            <template #subtitle>
                {{useCase.subtitle}}
            </template>
        </v-list-item>
        <v-list-subheader>Test cases</v-list-subheader>
        <v-list-item 
            v-for="testCase in testCases"
            :key="testCase.id"
            :value="testCase.id"
            color="primary"
            lines="three"
            :active="selected == testCase.id"
            @click="() => selectExample(testCase.id)"
            >
            <template #title>
                {{testCase.title}}
            </template>
            <template #subtitle>
                {{testCase.subtitle}}
            </template>
        </v-list-item>
    </v-list>
</template>