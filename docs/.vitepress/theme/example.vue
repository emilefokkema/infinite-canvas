<template>
    <div class="example-container language-infinite-canvas">
        <div class="iframe-container">
            <div 
                class="overlay"
                :class="{'active': overlayActive, 'disappearing': overlayDisappearing}">
                <div class="overlay-message">{{ overlayMessage }}</div>
            </div>
            <iframe :style="{'height': height + 'px'}" ref="iFrame" :class="{'no-overflow': overflowHidden}" :scrolling="overflowHidden ? 'no' : 'yes'"></iframe>
        </div>
        <div class="example-footer">
            <stackblitz-button :example-id="exampleId"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, onBeforeUnmount } from 'vue'
import StackblitzButton from './StackblitzButton.vue'
import { exampleRegistryInjectionKey } from './constants';
import type { ExampleRegistry, ExamplePageInfiniteCanvasProxy } from './example-registry'

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
const registry = inject(exampleRegistryInjectionKey) as ExampleRegistry
const iFrame = ref<HTMLIFrameElement | null>(null)
const overlayActive = ref<boolean>(false);
const overlayDisappearing = ref<boolean>(false)
const overlayMessage = ref<string | null>(null)

function onExampleInfiniteCanvasInitialized(source: MessageEventSource, proxy: ExamplePageInfiniteCanvasProxy): void{
    const iFrameValue = iFrame.value;
    if(!iFrameValue || source !== iFrameValue.contentWindow){
        return;
    }
    proxy.disableGreedyGestureHandling();
    proxy.addWheelIgnoredListener(onWheelIgnored)
    proxy.addTouchIgnoredListener(onTouchIgnored)
}

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

function onWheelIgnored(): void{
    displayOverlay('Use Ctrl + scroll to zoom');
}

function onTouchIgnored(): void{
    displayOverlay('Use two fingers to move')
}
onMounted(() => {
    const iFrameValue = iFrame.value;
    if(!iFrameValue){
        return;
    }
    const url = new URL(`/examples/${props.exampleId}/`, location.href).toString();
    registry.addInitializedListener(onExampleInfiniteCanvasInitialized);
    iFrameValue.src = url;
})
onBeforeUnmount(() => {
    registry.removeInitializedListener(onExampleInfiniteCanvasInitialized, iFrame.value ? iFrame.value.contentWindow || undefined : undefined);
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
    background-color: #000000;
    width: 100%;
    height: 100%;
    
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