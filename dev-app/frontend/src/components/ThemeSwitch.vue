<script setup lang="ts">
import { useAppTheme } from '../app-theme'

const theme = useAppTheme()
function toggleTheme () {
  theme.dark.value = !theme.dark.value;
}
</script>

<template>
    <v-btn>
        <v-icon icon="mdi-theme-light-dark" @click="toggleTheme"/>
    </v-btn>
</template>