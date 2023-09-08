<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import MyHomeHeroImage from './my-home-hero-image.vue'

const { Layout } = DefaultTheme;
</script>
<template>
    <Layout>
        <template #home-hero-image>
            <my-home-hero-image />
        </template>
    </Layout>
</template>