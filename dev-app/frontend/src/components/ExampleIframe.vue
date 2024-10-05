<script setup lang="ts">
import { ref } from 'vue'
import { useCurrentExampleUrl } from '../current-example-url';
import { useAppTheme } from '../app-theme';
import { useDarkIframeUrl } from '../../../../utils/dark-theme/frontend/vue-plugin';

const iFrame = ref<HTMLIFrameElement | null>(null);
const url = useCurrentExampleUrl()
const {dark} = useAppTheme()
const darkUrl = useDarkIframeUrl({
    viteContentType: 'served',
    url,
    dark,
    iFrame
})

</script>
<template>
    <div class="iframe-container">
        <iframe ref="iFrame" :src="darkUrl" />
    </div>
</template>

<style lang="css" scoped>
.iframe-container{
    height: 100%;
}
iframe{
    width: 100%;
    height: 100%;
    border: none;
}
</style>