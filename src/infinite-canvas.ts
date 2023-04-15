import {InfiniteCanvasRenderingContext2D} from "./api-surface/infinite-canvas-rendering-context-2d"
import {InfiniteContext} from "./infinite-context/infinite-context"
import {ViewBox} from "./interfaces/viewbox";
import {InfiniteCanvasViewBox} from "./infinite-canvas-viewbox";
import {InfiniteCanvasTransformer} from "./transformer/infinite-canvas-transformer";
import {Config} from "./api-surface/config";
import {AnimationFrameDrawingIterationProvider} from "./animation-frame-drawing-iteration-provider";
import { EventMap } from './api-surface/event-map';
import {DrawingIterationProviderWithCallback} from "./drawing-iteration-provider-with-callback";
import {LockableDrawingIterationProvider} from "./lockable-drawing-iteration-provider";
import {CanvasRectangle} from "./rectangle/canvas-rectangle";
import {CanvasRectangleImpl} from "./rectangle/canvas-rectangle-impl";
import {HtmlCanvasMeasurementProvider} from "./rectangle/html-canvas-measurement-provider";
import {Units} from "./api-surface/units";
import {CanvasResizeObserver} from "./canvas-resize-observer";
import {HtmlCanvasResizeObserver} from "./html-canvas-resize-observer";
import {representTransformation} from "./transformer/represent-transformation";
import {InfiniteCanvas as InfiniteCanvasInterface, InfiniteCanvasCtr} from './api-surface/infinite-canvas'
import {InfiniteCanvasEventCollection} from "./events/event-collections/infinite-canvas-event-collection";
import {TransformationRepresentation} from "./api-surface/transformation-representation";
import { EventCollection } from './events/event-collections/event-collection';
import { TransformationEvent } from "./api-surface/transformation-event";
import { DrawEvent } from "./api-surface/draw-event";
import { InfiniteCanvasEventWithDefaultBehavior } from "./api-surface/infinite-canvas-event-with-default-behavior";
import { InfiniteCanvasTouchEvent } from "./api-surface/infinite-canvas-touch-event";
import { CssLengthConverterImpl } from "./css-length-converter-impl";
import { CssLengthConverterFactory } from "./css-length-converter-factory";

class InfiniteCanvas implements InfiniteCanvasInterface{
	private context: InfiniteCanvasRenderingContext2D;
	private viewBox: ViewBox;
	private config: Config;
	private rectangle: CanvasRectangle;
	private canvasResizeObserver: CanvasResizeObserver;
	private canvasResizeListener: () => void;
	private readonly eventCollection: EventCollection<EventMap>;
    private readonly cssLengthConverterFactory: CssLengthConverterFactory;
	constructor(private readonly canvas: HTMLCanvasElement, config?: Config){
		this.config = {rotationEnabled: true, greedyGestureHandling: false, units: Units.CANVAS};
		if(config){
			Object.assign(this.config, config)
		}
		this.canvasResizeObserver = new HtmlCanvasResizeObserver(canvas);
		this.canvasResizeListener = () => {
			if(this.canvas.parentElement === null){
				return;
			}
			this.viewBox.draw();
		};
		const drawingIterationProvider: DrawingIterationProviderWithCallback = new DrawingIterationProviderWithCallback(new AnimationFrameDrawingIterationProvider());
		const lockableDrawingIterationProvider: LockableDrawingIterationProvider = new LockableDrawingIterationProvider(drawingIterationProvider);
		this.rectangle = new CanvasRectangleImpl(new HtmlCanvasMeasurementProvider(canvas), this.config);
		let transformer: InfiniteCanvasTransformer;
        const context = canvas.getContext("2d");
        this.cssLengthConverterFactory = {
            create: () => new CssLengthConverterImpl(context)
        };
		this.viewBox = new InfiniteCanvasViewBox(
			this.rectangle,
			context,
			lockableDrawingIterationProvider,
			() => lockableDrawingIterationProvider.getLock(),
			() => transformer.isTransforming);
		transformer = new InfiniteCanvasTransformer(this.viewBox, this.config);
		this.eventCollection = InfiniteCanvasEventCollection.create(canvas, transformer, this.rectangle, this, this.config, drawingIterationProvider);
		if(config && config.units === Units.CSS){
			this.canvasResizeObserver.addListener(this.canvasResizeListener);
		}
	}
	private setUnits(units: Units): void{
		if(units === Units.CSS && this.config.units !== Units.CSS){
			this.canvasResizeObserver.addListener(this.canvasResizeListener);
		}
		if(units !== Units.CSS && this.config.units === Units.CSS){
			this.canvasResizeObserver.removeListener(this.canvasResizeListener);
		}
		this.config.units = units;
		this.rectangle.measure();
		this.viewBox.draw();
	}
	public getContext(): InfiniteCanvasRenderingContext2D{
		if(!this.context){
			this.context = new InfiniteContext(this.canvas, this.viewBox, this.cssLengthConverterFactory);
		}
		return this.context;
	}
	public get transformation(): TransformationRepresentation{
		return representTransformation(this.rectangle.inverseInfiniteCanvasContextBase);
	}
	public get inverseTransformation(): TransformationRepresentation{
		return representTransformation(this.rectangle.infiniteCanvasContextBase);
	}
	public get rotationEnabled(): boolean{
		return this.config.rotationEnabled;
	}
	public set rotationEnabled(value: boolean){
		this.config.rotationEnabled = value;
	}
	public get units(): Units{
		return this.config.units;
	}
	public set units(value: Units){
		this.setUnits(value)
	}
	public get greedyGestureHandling(): boolean{
		return this.config.greedyGestureHandling;
	}
	public set greedyGestureHandling(value: boolean){
		this.config.greedyGestureHandling = value;
	}
	public set ontransformationstart(value: (this: InfiniteCanvasInterface, event: TransformationEvent) => any){
		this.eventCollection.setOn('transformationstart', value);
	}
	public get ontransformationstart(): (this: InfiniteCanvasInterface, event: TransformationEvent) => any{
		return this.eventCollection.getOn('transformationstart');
	}
	public set ontransformationchange(value: (this: InfiniteCanvasInterface, event: TransformationEvent) => any){
		this.eventCollection.setOn('transformationchange', value);
	}
	public get ontransformationchange(): (this: InfiniteCanvasInterface, event: TransformationEvent) => any{
		return this.eventCollection.getOn('transformationchange');
	}
	public set ontransformationend(value: (this: InfiniteCanvasInterface, event: TransformationEvent) => any){
		this.eventCollection.setOn('transformationend', value);
	}
	public get ontransformationend(): (this: InfiniteCanvasInterface, event: TransformationEvent) => any{
		return this.eventCollection.getOn('transformationend');
	}
	public set ondraw(value: (this: InfiniteCanvasInterface, event: DrawEvent) => any){
		this.eventCollection.setOn('draw', value);
	}
	public get ondraw(): (this: InfiniteCanvasInterface, event: DrawEvent) => any{
		return this.eventCollection.getOn('draw');
	}
    public set onwheelignored(value: (this: InfiniteCanvasInterface, event: Event) => any){
		this.eventCollection.setOn('wheelignored', value);
	}
	public get onwheelignored(): (this: InfiniteCanvasInterface, event: Event) => any{
		return this.eventCollection.getOn('wheelignored');
	}
    public set ontouchignored(value: (this: InfiniteCanvasInterface, event: Event) => any){
		this.eventCollection.setOn('touchignored', value);
	}
	public get ontouchignored(): (this: InfiniteCanvasInterface, event: Event) => any{
		return this.eventCollection.getOn('touchignored');
	}
    public set oncopy(value: (this: InfiniteCanvasInterface, event: ClipboardEvent) => any){
        this.eventCollection.setOn('copy', value);
    }
    public get oncopy(): (this: InfiniteCanvasInterface, event: ClipboardEvent) => any{
        return this.eventCollection.getOn('copy');
    }
    public set oncut(value: (this: InfiniteCanvasInterface, event: ClipboardEvent) => any){
        this.eventCollection.setOn('cut', value);
    }
    public get oncut(): (this: InfiniteCanvasInterface, event: ClipboardEvent) => any{
        return this.eventCollection.getOn('cut');
    }
    public set onpaste(value: (this: InfiniteCanvasInterface, event: ClipboardEvent) => any){
        this.eventCollection.setOn('paste', value);
    }
    public get onpaste(): (this: InfiniteCanvasInterface, event: ClipboardEvent) => any{
        return this.eventCollection.getOn('paste');
    }
    public set onabort(value: (this: InfiniteCanvasInterface, event: UIEvent) => any){
        this.eventCollection.setOn('abort', value);
    }
    public get onabort(): (this: InfiniteCanvasInterface, event: UIEvent) => any{
        return this.eventCollection.getOn('abort');
    }
    public set onanimationcancel(value: (this: InfiniteCanvasInterface, event: AnimationEvent) => any){
        this.eventCollection.setOn('animationcancel', value);
    }
    public get onanimationcancel(): (this: InfiniteCanvasInterface, event: AnimationEvent) => any{
        return this.eventCollection.getOn('animationcancel');
    }
    public set onanimationend(value: (this: InfiniteCanvasInterface, event: AnimationEvent) => any){
        this.eventCollection.setOn('animationend', value);
    }
    public get onanimationend(): (this: InfiniteCanvasInterface, event: AnimationEvent) => any{
        return this.eventCollection.getOn('animationend');
    }
    public set onanimationiteration(value: (this: InfiniteCanvasInterface, event: AnimationEvent) => any){
        this.eventCollection.setOn('animationiteration', value);
    }
    public get onanimationiteration(): (this: InfiniteCanvasInterface, event: AnimationEvent) => any{
        return this.eventCollection.getOn('animationiteration');
    }
    public set onanimationstart(value: (this: InfiniteCanvasInterface, event: AnimationEvent) => any){
        this.eventCollection.setOn('animationstart', value);
    }
    public get onanimationstart(): (this: InfiniteCanvasInterface, event: AnimationEvent) => any{
        return this.eventCollection.getOn('animationstart');
    }
    public set onauxclick(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('auxclick', value);
    }
    public get onauxclick(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('auxclick');
    }
    public set onblur(value: (this: InfiniteCanvasInterface, event: FocusEvent) => any){
        this.eventCollection.setOn('blur', value);
    }
    public get onblur(): (this: InfiniteCanvasInterface, event: FocusEvent) => any{
        return this.eventCollection.getOn('blur');
    }
    public get oncanplay(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('canplay');
    }
    public set oncanplay(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('canplay', value);
    }
    public get oncanplaythrough(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('canplaythrough');
    }
    public set oncanplaythrough(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('canplaythrough', value);
    }
    public get onchange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('change');
    }
    public set onchange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('change', value);
    }
    public get onclick(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('click');
    }
    public set onclick(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('click', value);
    }
    public get onclose(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('close');
    }
    public set onclose(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('close', value);
    }
    public get oncontextmenu(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('contextmenu');
    }
    public set oncontextmenu(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('contextmenu', value);
    }
    public get oncuechange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('cuechange');
    }
    public set oncuechange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('cuechange', value);
    }
    public get ondblclick(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('dblclick');
    }
    public set ondblclick(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('dblclick', value);
    }
    public get ondrag(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('drag');
    }
    public set ondrag(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('drag', value);
    }
    public get ondragend(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('dragend');
    }
    public set ondragend(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('dragend', value);
    }
    public get ondragenter(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('dragenter');
    }
    public set ondragenter(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('dragenter', value);
    }
    public get onformdata(): (this: InfiniteCanvasInterface, event: FormDataEvent) => any{
        return this.eventCollection.getOn('formdata');
    }
    public set onformdata(value: (this: InfiniteCanvasInterface, event: FormDataEvent) => any){
        this.eventCollection.setOn('formdata', value);
    }
    public get onwebkitanimationend(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('webkitanimationend');
    }
    public set onwebkitanimationend(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('webkitanimationend', value);
    }
    public get onwebkitanimationstart(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('webkitanimationstart');
    }
    public set onwebkitanimationstart(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('webkitanimationstart', value);
    }
    public get onwebkitanimationiteration(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('webkitanimationiteration');
    }
    public set onwebkitanimationiteration(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('webkitanimationiteration', value);
    }
    public get onwebkittransitionend(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('webkittransitionend');
    }
    public set onwebkittransitionend(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('webkittransitionend', value);
    }
    public get onslotchange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('slotchange');
    }
    public set onslotchange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('slotchange', value);
    }
    public get ondragleave(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('dragleave');
    }
    public set ondragleave(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('dragleave', value);
    }
    public get ondragover(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('dragover');
    }
    public set ondragover(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('dragover', value);
    }
    public get ondragstart(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('dragstart');
    }
    public set ondragstart(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('dragstart', value);
    }
    public get ondrop(): (this: InfiniteCanvasInterface, event: DragEvent) => any{
        return this.eventCollection.getOn('drop');
    }
    public set ondrop(value: (this: InfiniteCanvasInterface, event: DragEvent) => any){
        this.eventCollection.setOn('drop', value);
    }
    public get ondurationchange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('durationchange');
    }
    public set ondurationchange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('durationchange', value);
    }
    public get onemptied(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('emptied');
    }
    public set onemptied(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('emptied', value);
    }
    public get onended(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('ended');
    }
    public set onended(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('ended', value);
    }
	public get onerror(): OnErrorEventHandler{
		return this.eventCollection.getOn('error');
	}
	public set onerror(value: OnErrorEventHandler){
		this.eventCollection.setOn('error', value);
	}
    public get onfocus(): (this: InfiniteCanvasInterface, event: FocusEvent) => any{
        return this.eventCollection.getOn('focus');
    }
    public set onfocus(value: (this: InfiniteCanvasInterface, event: FocusEvent) => any){
        this.eventCollection.setOn('focus', value);
    }
    public get ongotpointercapture(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('gotpointercapture');
    }
    public set ongotpointercapture(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('gotpointercapture', value);
    }
    public get oninput(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('input');
    }
    public set oninput(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('input', value);
    }
    public get oninvalid(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('invalid');
    }
    public set oninvalid(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('invalid', value);
    }
    public get onkeydown(): (this: InfiniteCanvasInterface, event: KeyboardEvent) => any{
        return this.eventCollection.getOn('keydown');
    }
    public set onkeydown(value: (this: InfiniteCanvasInterface, event: KeyboardEvent) => any){
        this.eventCollection.setOn('keydown', value);
    }
    public get onkeypress(): (this: InfiniteCanvasInterface, event: KeyboardEvent) => any{
        return this.eventCollection.getOn('keypress');
    }
    public set onkeypress(value: (this: InfiniteCanvasInterface, event: KeyboardEvent) => any){
        this.eventCollection.setOn('keypress', value);
    }
    public get onkeyup(): (this: InfiniteCanvasInterface, event: KeyboardEvent) => any{
        return this.eventCollection.getOn('keyup');
    }
    public set onkeyup(value: (this: InfiniteCanvasInterface, event: KeyboardEvent) => any){
        this.eventCollection.setOn('keyup', value);
    }
    public get onload(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('load');
    }
    public set onload(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('load', value);
    }
    public get onloadeddata(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('loadeddata');
    }
    public set onloadeddata(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('loadeddata', value);
    }
    public get onloadedmetadata(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('loadedmetadata');
    }
    public set onloadedmetadata(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('loadedmetadata', value);
    }
    public get onloadstart(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('loadstart');
    }
    public set onloadstart(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('loadstart', value);
    }
    public get onlostpointercapture(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('lostpointercapture');
    }
    public set onlostpointercapture(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('lostpointercapture', value);
    }
    public get onmousedown(): (this: InfiniteCanvasInterface, event: MouseEvent & InfiniteCanvasEventWithDefaultBehavior) => any{
        return this.eventCollection.getOn('mousedown');
    }
    public set onmousedown(value: (this: InfiniteCanvasInterface, event: MouseEvent & InfiniteCanvasEventWithDefaultBehavior) => any){
        this.eventCollection.setOn('mousedown', value);
    }
    public get onmouseenter(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mouseenter');
    }
    public set onmouseenter(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mouseenter', value);
    }
    public get onmouseleave(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mouseleave');
    }
    public set onmouseleave(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mouseleave', value);
    }
    public get onmousemove(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mousemove');
    }
    public set onmousemove(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mousemove', value);
    }
    public get onmouseout(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mouseout');
    }
    public set onmouseout(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mouseout', value);
    }
    public get onmouseover(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mouseover');
    }
    public set onmouseover(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mouseover', value);
    }
    public get onmouseup(): (this: InfiniteCanvasInterface, event: MouseEvent) => any{
        return this.eventCollection.getOn('mouseup');
    }
    public set onmouseup(value: (this: InfiniteCanvasInterface, event: MouseEvent) => any){
        this.eventCollection.setOn('mouseup', value);
    }
    public get onpause(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('pause');
    }
    public set onpause(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('pause', value);
    }
    public get onplay(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('play');
    }
    public set onplay(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('play', value);
    }
    public get onplaying(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('playing');
    }
    public set onplaying(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('playing', value);
    }
    public get onpointercancel(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointercancel');
    }
    public set onpointercancel(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointercancel', value);
    }
    public get onpointerdown(): (this: InfiniteCanvasInterface, event: PointerEvent & InfiniteCanvasEventWithDefaultBehavior) => any{
        return this.eventCollection.getOn('pointerdown');
    }
    public set onpointerdown(value: (this: InfiniteCanvasInterface, event: PointerEvent & InfiniteCanvasEventWithDefaultBehavior) => any){
        this.eventCollection.setOn('pointerdown', value);
    }
    public get onpointerenter(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointerenter');
    }
    public set onpointerenter(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointerenter', value);
    }
    public get onpointerleave(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointerleave');
    }
    public set onpointerleave(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointerleave', value);
    }
    public get onpointermove(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointermove');
    }
    public set onpointermove(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointermove', value);
    }
    public get onpointerout(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointerout');
    }
    public set onpointerout(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointerout', value);
    }
    public get onpointerover(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointerover');
    }
    public set onpointerover(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointerover', value);
    }
    public get onpointerup(): (this: InfiniteCanvasInterface, event: PointerEvent) => any{
        return this.eventCollection.getOn('pointerup');
    }
    public set onpointerup(value: (this: InfiniteCanvasInterface, event: PointerEvent) => any){
        this.eventCollection.setOn('pointerup', value);
    }
    public get onprogress(): (this: InfiniteCanvasInterface, event: ProgressEvent) => any{
        return this.eventCollection.getOn('progress');
    }
    public set onprogress(value: (this: InfiniteCanvasInterface, event: ProgressEvent) => any){
        this.eventCollection.setOn('progress', value);
    }
    public get onratechange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('ratechange');
    }
    public set onratechange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('ratechange', value);
    }
    public get onreset(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('reset');
    }
    public set onreset(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('reset', value);
    }
    public get onresize(): (this: InfiniteCanvasInterface, event: UIEvent) => any{
        return this.eventCollection.getOn('resize');
    }
    public set onresize(value: (this: InfiniteCanvasInterface, event: UIEvent) => any){
        this.eventCollection.setOn('resize', value);
    }
    public get onscroll(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('scroll');
    }
    public set onscroll(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('scroll', value);
    }
    public get onsecuritypolicyviolation(): (this: InfiniteCanvasInterface, event: SecurityPolicyViolationEvent) => any{
        return this.eventCollection.getOn('securitypolicyviolation');
    }
    public set onsecuritypolicyviolation(value: (this: InfiniteCanvasInterface, event: SecurityPolicyViolationEvent) => any){
        this.eventCollection.setOn('securitypolicyviolation', value);
    }
    public get onseeked(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('seeked');
    }
    public set onseeked(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('seeked', value);
    }
    public get onseeking(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('seeking');
    }
    public set onseeking(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('seeking', value);
    }
    public get onselect(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('select');
    }
    public set onselect(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('select', value);
    }
    public get onselectionchange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('selectionchange');
    }
    public set onselectionchange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('selectionchange', value);
    }
    public get onselectstart(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('selectstart');
    }
    public set onselectstart(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('selectstart', value);
    }
    public get onstalled(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('stalled');
    }
    public set onstalled(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('stalled', value);
    }
    public get onsubmit(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('submit');
    }
    public set onsubmit(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('submit', value);
    }
    public get onsuspend(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('suspend');
    }
    public set onsuspend(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('suspend', value);
    }
    public get ontimeupdate(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('timeupdate');
    }
    public set ontimeupdate(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('timeupdate', value);
    }
    public get ontoggle(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('toggle');
    }
    public set ontoggle(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('toggle', value);
    }
    public get ontouchcancel(): (this: InfiniteCanvasInterface, event: TouchEvent) => any{
        return this.eventCollection.getOn('touchcancel');
    }
    public set ontouchcancel(value: (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent) => any){
        this.eventCollection.setOn('touchcancel', value);
    }
    public get ontouchend(): (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent) => any{
        return this.eventCollection.getOn('touchend');
    }
    public set ontouchend(value: (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent) => any){
        this.eventCollection.setOn('touchend', value);
    }
    public get ontouchmove(): (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent) => any{
        return this.eventCollection.getOn('touchmove');
    }
    public set ontouchmove(value: (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent) => any){
        this.eventCollection.setOn('touchmove', value);
    }
    public get ontouchstart(): (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior) => any{
        return this.eventCollection.getOn('touchstart');
    }
    public set ontouchstart(value: (this: InfiniteCanvasInterface, event: InfiniteCanvasTouchEvent & InfiniteCanvasEventWithDefaultBehavior) => any){
        this.eventCollection.setOn('touchstart', value);
    }
    public get ontransitioncancel(): (this: InfiniteCanvasInterface, event: TransitionEvent) => any{
        return this.eventCollection.getOn('transitioncancel');
    }
    public set ontransitioncancel(value: (this: InfiniteCanvasInterface, event: TransitionEvent) => any){
        this.eventCollection.setOn('transitioncancel', value);
    }
    public get ontransitionend(): (this: InfiniteCanvasInterface, event: TransitionEvent) => any{
        return this.eventCollection.getOn('transitionend');
    }
    public set ontransitionend(value: (this: InfiniteCanvasInterface, event: TransitionEvent) => any){
        this.eventCollection.setOn('transitionend', value);
    }
    public get ontransitionrun(): (this: InfiniteCanvasInterface, event: TransitionEvent) => any{
        return this.eventCollection.getOn('transitionrun');
    }
    public set ontransitionrun(value: (this: InfiniteCanvasInterface, event: TransitionEvent) => any){
        this.eventCollection.setOn('transitionrun', value);
    }
    public get ontransitionstart(): (this: InfiniteCanvasInterface, event: TransitionEvent) => any{
        return this.eventCollection.getOn('transitionstart');
    }
    public set ontransitionstart(value: (this: InfiniteCanvasInterface, event: TransitionEvent) => any){
        this.eventCollection.setOn('transitionstart', value);
    }
    public get onvolumechange(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('volumechange');
    }
    public set onvolumechange(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('volumechange', value);
    }
    public get onwaiting(): (this: InfiniteCanvasInterface, event: Event) => any{
        return this.eventCollection.getOn('waiting');
    }
    public set onwaiting(value: (this: InfiniteCanvasInterface, event: Event) => any){
        this.eventCollection.setOn('waiting', value);
    }
    public get onwheel(): (this: InfiniteCanvasInterface, event: WheelEvent & InfiniteCanvasEventWithDefaultBehavior) => any{
        return this.eventCollection.getOn('wheel');
    }
    public set onwheel(value: (this: InfiniteCanvasInterface, event: WheelEvent & InfiniteCanvasEventWithDefaultBehavior) => any){
        this.eventCollection.setOn('wheel', value);
    }
    public addEventListener<K extends keyof EventMap>(type: K, listener: ((this: InfiniteCanvasInterface, ev: EventMap[K]) => any) | EventListenerObject, options?: boolean | AddEventListenerOptions): void{
        this.eventCollection.addEventListener(type, listener, options);
    }
    public removeEventListener<K extends keyof EventMap>(type: K, listener: ((this: InfiniteCanvasInterface, ev: EventMap[K]) => any) | EventListenerObject, options?: boolean | EventListenerOptions): void{
        this.eventCollection.removeEventListener(type, listener, options);
    }
    public static CANVAS_UNITS: Units = Units.CANVAS;
    public static CSS_UNITS: Units = Units.CSS;
}

const ctr: InfiniteCanvasCtr = InfiniteCanvas;

export {ctr as InfiniteCanvas};
