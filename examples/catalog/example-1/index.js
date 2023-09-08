import './style.css'
import InfiniteCanvas from 'ef-infinite-canvas';
import { doThisSharedThing } from './shared-logic.js'

const canvas = document.getElementById('canvas')
doThisSharedThing();
const ctx = new InfiniteCanvas(canvas).getContext('2d');
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(200, 50);
ctx.stroke();