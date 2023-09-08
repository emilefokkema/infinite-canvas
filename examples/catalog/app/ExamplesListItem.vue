<script setup lang="ts">
import { ref, watchEffect, type PropType } from 'vue'
import ExampleLink from './ExampleLink.vue'
import type { DisplayableExample } from './examples-store'
import { getExampleUrl } from './example-url'

const props = defineProps({
    example: {
        type: Object as PropType<DisplayableExample>,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    },
    visible: {
        type: Boolean,
        required: true
    }
})

const li = ref<HTMLLIElement | null>(null)
const emit = defineEmits<{
    (event: 'selected'): void
}>()

function select(){
    emit('selected')
}

watchEffect(() => {
    if(!props.selected || !li.value || !props.visible){
        return;
    }
    li.value.scrollIntoView({block: 'nearest'});
})
</script>

<template>
    <li ref="li" class="examples-list-item" :class="{'selected': selected}"><span @click="select">{{ example.description.title }}</span> <example-link :url="getExampleUrl(example)"/></li>
</template>

<style scoped lang="css">
.examples-list-item{
    user-select: none;
    
}
.examples-list-item:nth-child(even){
    background-image: url('/examples-list-background.svg');
}
.examples-list-item.selected{
    list-style-type: disc;
    text-decoration: underline;
}
.example-link{
    text-decoration: none;
}
</style>