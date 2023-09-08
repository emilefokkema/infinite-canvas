<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {default as InfiniteCanvas, Units, type InfiniteCanvasRenderingContext2D} from 'infinite-canvas';

const mainThingWidth = 592;
const containerMaxWidth = 1152;
const paddingLeft = 64;
const imageNegativeTopMargin = 76;
const imageNegativeTopMargin2 = 108;
const imageContainerSize = 320;
const imageContainerSize2 = 392;
const navHeight = 64;

const hoversOnLink = ref(false);
const canvas = ref<HTMLCanvasElement | null>(null)

async function loadImage(url: string): Promise<HTMLImageElement | null>{
    const image = new Image();
    const loadPromise = new Promise<void>((res, rej) => {
        image.addEventListener('load', () => res(), {once: true})
        image.addEventListener('error', (e) => rej(e.error), {once: true})
    })
    image.src = url;
    try{
        await loadPromise;
    }catch{
        return null;
    }
    return image;
}

interface LinkArea{
    x: number
    y: number
    width: number
    height: number
    url: string
}

function createLinkAreas(infCanvas: InstanceType<typeof InfiniteCanvas>, linkAreas: LinkArea[]): void{
    infCanvas.addEventListener('mousemove', ({offsetX, offsetY}) => {
        const linkArea = findLinkArea(offsetX, offsetY);
        hoversOnLink.value = !!linkArea;
    })
    infCanvas.addEventListener('click', ({offsetX, offsetY}) => {
        const linkArea = findLinkArea(offsetX, offsetY);
        if(!linkArea){
            return;
        }
        window.open(linkArea.url, '_blank')
    })
    infCanvas.addEventListener('pointerdown', (e) => {
        const {offsetX, offsetY} = e;
        const linkArea = findLinkArea(offsetX, offsetY);
        if(linkArea){
            e.preventDefault();
        }
    })
    function findLinkArea(offsetX: number, offsetY: number): LinkArea | undefined{
        return linkAreas.find(a => isOnLinkArea(offsetX, offsetY, a))
    }
    function isOnLinkArea(offsetX: number, offsetY: number, linkArea: LinkArea): boolean{
        return offsetX >= linkArea.x && offsetX <= linkArea.x + linkArea.width && offsetY >= linkArea.y && offsetY <= linkArea.y + linkArea.height;
    }
}

async function drawImage(ctx: InfiniteCanvasRenderingContext2D, linkAreas: LinkArea[]): Promise<void>{
    const [logoImage, githubImage, npmImage] = await Promise.all([
        loadImage('/logo.svg'),
        loadImage('https://img.shields.io/github/stars/emilefokkema/infinite-canvas.svg?style=social&label=Star&maxAge=2592000'),
        loadImage('https://img.shields.io/npm/v/ef-infinite-canvas?logo=npm&color=%2344cc11')
    ])
   
    const originXOffsetBig = 120;
    const originYOffsetBig = 130;
    const originX = window.innerWidth < 960 
        ? window.innerWidth / 2
        : ( window.innerWidth < 1280 
            ? mainThingWidth + paddingLeft + originXOffsetBig
            : window.innerWidth / 2 - containerMaxWidth / 2 + mainThingWidth + originXOffsetBig);
    
   
    const originY = window.innerWidth < 640
        ?  (navHeight + 48 - imageNegativeTopMargin + imageContainerSize / 2)
        : window.innerWidth < 960 ? (navHeight + 80 - imageNegativeTopMargin2 + imageContainerSize2 / 2) : navHeight + 80 + originYOffsetBig;
    const bottomOfLogo = 60 * .8 * .95 + 120 * .035 * .8;

    ctx.translate(originX, originY);
    const g1 = ctx.createLinearGradient(0, bottomOfLogo, 0, -1.5*bottomOfLogo);
    g1.addColorStop(0, '#99b2c977');
    g1.addColorStop(1, '#99b2c90a')
    ctx.fillStyle = g1;
    ctx.fillRect(-Infinity, bottomOfLogo, Infinity, -Infinity)
    const g2 = ctx.createLinearGradient(0, bottomOfLogo, 0, 2 * bottomOfLogo);
    g2.addColorStop(0, '#0069c277')
    g2.addColorStop(1, '#0069c200')
    ctx.fillStyle = g2;
    ctx.fillRect(-Infinity, bottomOfLogo, Infinity, Infinity);
    if(logoImage){
        ctx.drawImage(logoImage, -60, -60)
    }
    ctx.translate(-bottomOfLogo, bottomOfLogo);
    const linkScaleFactor = .05;
    ctx.scale(linkScaleFactor, linkScaleFactor)
    let imgY: number = 10;
    if(githubImage){
        ctx.drawImage(githubImage, 0, imgY)
        linkAreas.push({
            x: originX - bottomOfLogo,
            y: originY + bottomOfLogo + imgY * linkScaleFactor,
            width: githubImage.width * linkScaleFactor,
            height: githubImage.height * linkScaleFactor,
            url: 'https://github.com/emilefokkema/infinite-canvas'
        })
    }
    if(npmImage){
        imgY += (githubImage ? githubImage.height : 0) + 10;
        ctx.drawImage(npmImage, 0, imgY)
        linkAreas.push({
            x: originX - bottomOfLogo,
            y: originY + bottomOfLogo + imgY * linkScaleFactor,
            width: npmImage.width * linkScaleFactor,
            height: npmImage.height * linkScaleFactor,
            url: 'https://www.npmjs.com/package/ef-infinite-canvas'
        })
    }
}
onMounted(async () => {
    const canvasEl = canvas.value as HTMLCanvasElement;
    const { width, height } = canvasEl.getBoundingClientRect();
    canvasEl.width = width * devicePixelRatio;
    canvasEl.height = height * devicePixelRatio;

    const infCanvas = new InfiniteCanvas(
        canvasEl,
        {
            units: Units.CSS,
            greedyGestureHandling: true
        });
    const ctx = infCanvas.getContext('2d');
    const linkAreas: LinkArea[] = [];
    await drawImage(ctx, linkAreas);
    createLinkAreas(infCanvas, linkAreas);
})
</script>
<template>
    <div class="container">
        <canvas ref="canvas" :class="{'link-hovered': hoversOnLink}"></canvas>
    </div>
</template>
<style lang="css" scoped>
canvas{
    width: 100%;
    height: 100%;
}
canvas.link-hovered{
    cursor: pointer;
}
.container{
    --image-container-width: 320px;
    --image-container-width-2: 392px;
    --main-thing-width: 592px;
    --image-container-translation: 32px;
    --image-negative-margin-top: 76px;
    --container-max-width: 1152px;
    width: 100vw;
    height: 392px;
    position: absolute;
    left: calc(-50vw + var(--image-container-width) / 2);
    top: calc(var(--image-negative-margin-top) - var(--vp-nav-height) - 48px);
}
@media(min-width: 640px){
    .container{
        left: calc(-50vw + var(--image-container-width-2) / 2);
    }
}
@media(min-width: 960px){
    .container{
        top: calc(var(--image-container-translation) - var(--vp-nav-height) - 80px);
        left: calc(var(--image-container-translation) - var(--main-thing-width) - 64px);
    }
}
@media(min-width: 1280px){
    .container{
        left: calc(var(--image-container-translation) - var(--main-thing-width) + var(--container-max-width) / 2 - 50vw)
    }
}
</style>