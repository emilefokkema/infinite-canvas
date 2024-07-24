<template>
    <div class="example-container language-infinite-canvas" :class="{'dark': isDark}" ref="exampleContainer">
        <div class="iframe-container">
            <div 
                class="overlay"
                :class="{'active': overlayActive, 'disappearing': overlayDisappearing}">
                <div class="overlay-message">{{ overlayMessage }}</div>
            </div>
            <iframe :style="{'height': height + 'px'}" ref="iFrame" :src="darkExampleUrl" :class="{'no-overflow': overflowHidden}" :scrolling="overflowHidden ? 'no' : 'yes'"></iframe>
        </div>
        <div class="example-footer">
            <stackblitz-button :example-id="exampleId"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed, watchEffect } from 'vue'
import { useData } from 'vitepress';
import StackblitzButton from './StackblitzButton.vue'
import { messages } from './infinite-canvas-example/constants'
import { useDarkIframeUrl } from '../../../utils/dark-theme/frontend/vue-plugin'
import type { ViteContentType } from '../../../utils/dark-theme/frontend/shared/vite-content-type';

const viteContentType: ViteContentType = import.meta.env.MODE === 'development' ? 'served' : 'built';
const props = defineProps({
    exampleId: {
        type: String,
        required: true
    },
    overflowHidden: {
        type: Boolean,
        required: false,
        default: true
    },
    height: {
        type: Number,
        required: false,
        default: 250
    }
})
const { exampleId } = toRefs(props)
const iFrame = ref<HTMLIFrameElement | null>(null)
const exampleContainer = ref<HTMLDivElement | null>(null)
const { isDark } = useData();
const overlayActive = ref<boolean>(false);
const overlayDisappearing = ref<boolean>(false)
const overlayMessage = ref<string | null>(null)
const exampleUrl = computed(() => {
    if(typeof window === 'undefined' || !window || !window.location){
        return undefined;
    }
    return new URL(`/examples/${exampleId.value}/`, window.location.href).toString()
})
const darkExampleUrl = useDarkIframeUrl({
    iFrame,
    viteContentType,
    dark: isDark,
    url: exampleUrl
})

async function displayOverlay(message: string): Promise<void>{
    if(overlayActive.value){
        return;
    }
    overlayMessage.value = message;
    overlayActive.value = true;
    await new Promise(res => setTimeout(res, 200))
    overlayDisappearing.value = true;
    await new Promise(res => setTimeout(res, 1000))
    overlayActive.value = false;
    overlayDisappearing.value = false;
}

watchEffect((onCleanup) => {
    if(typeof window === 'undefined' || !window){
        return;
    }
    const iFrameValue = iFrame.value;
    if(!iFrameValue){
        return;
    }
    const iFrameWindow = iFrameValue.contentWindow;
    if(!iFrameWindow){
        return;
    }
    const touchIgnoredListener = messages.createMessageListener(
        iFrameWindow,
        'touchignored', () => displayOverlay('Use two fingers to move')
    )
    const wheelIgnoredListener = messages.createMessageListener(
        iFrameWindow,
        'wheelignored',
        () => displayOverlay('Use Ctrl + scroll to zoom')
    )
    window.addEventListener('message', wheelIgnoredListener);
    window.addEventListener('message', touchIgnoredListener)
    onCleanup(() => {
        window.removeEventListener('message', wheelIgnoredListener)
        window.removeEventListener('message', touchIgnoredListener)
    })
})

onMounted(() => {
    const iFrameValue = iFrame.value;
    if(iFrameValue){
        iFrameValue.src = darkExampleUrl.value || '';
    }
    const exampleContainerValue = exampleContainer.value;
    if(exampleContainerValue && isDark.value){
        exampleContainerValue.classList.add('dark')
    }
})

</script>

<style scoped lang="css">
iframe{
    width: 100%;
    border: none;
}
.iframe-container{
    position: relative;
}
.overlay{
    display: none;
    opacity: .7;
    position: absolute;
    background-color: #fff;
    width: 100%;
    height: 100%;
    
}
.example-container.dark .overlay{
    background-color: #000;
}
.overlay.active{
    display: initial;
    transition-property: opacity;
    transition-duration: 1s;
    transition-timing-function: ease-in;
}
.overlay.disappearing{
    opacity: 0;
}
.overlay-message{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
}
iframe.no-overflow{
    overflow: hidden;
}
.example-container{
    border: 1px solid var(--vp-c-divider);
    background-color: var(--vp-c-bg) !important;
}
.example-footer{
    padding: 3px;
    border-top: 1px solid var(--vp-c-divider);
    background-color: var(--vp-c-bg);
    display: flex;
    flex-direction: row;
    justify-content: right;
}
</style>