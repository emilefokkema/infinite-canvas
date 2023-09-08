<script setup lang="ts">
import { linkText } from './constants';
defineProps({
    url: {
        type: String,
        required: true
    }
})
</script>

<template>
    <a :href="url" target="_blank">{{ linkText }}</a>
</template>

<style lang="css" scoped>
a{
    text-decoration: none;
}
</style>