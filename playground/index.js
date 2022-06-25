import getTextContent from "../runtime-utils/get-text-content";
import { CodeRepository } from './code-repository';
import { PlaygroundLocalStorage } from './playground-local-storage';
import { SettingsRepository } from './settings-repository';
import Units from './units';

const canvasIframeUrlPromise = (async function(){
    let canvasHtml = await getTextContent('canvas.html');
    canvasHtml = canvasHtml.replace('INSERTBASEHREFHERE', document.baseURI);
    const blob = new Blob([canvasHtml], {type : 'text/html'});
    return URL.createObjectURL(blob);
})();

const isSmallWidth = window.innerWidth < 700;
const playgroundLocalStorage = PlaygroundLocalStorage.create();
const settingsRepository = SettingsRepository.create(playgroundLocalStorage, isSmallWidth);
const codeRepository = CodeRepository.create(playgroundLocalStorage);
const initialSettings = settingsRepository.getSettings();

const initialInputHeaderValues = {
    width: initialSettings.width,
    height: initialSettings.height,
    units: initialSettings.units,
    rotationEnabled: initialSettings.rotationEnabled,
    greedyGestureHandling: initialSettings.greedyGestureHandling
};

new Vue({
    el: '#app',
    data: function(){
        return {
            resizingInput: false,
            resizingCanvas: false,
            inputContainerWidth: initialSettings.inputContainerWidth,
            canvasHeight: initialSettings.canvasHeight,
            code: codeRepository.getCode(),
            running: false,
            instruction: undefined,
            additionalConfig: undefined,
            isHorizontal: initialSettings.isHorizontal,
            isSmallWidth: isSmallWidth,
            error: undefined,
            inputHeaderValues: initialInputHeaderValues,
            hasRunInitially: false,
            lastKnownCanvasSize: undefined
        };
    },
    methods: {
        onMouseMove(event){
            if(this.resizingInput){
                this.inputContainerWidth = window.innerWidth - event.clientX;
            }else if(this.resizingCanvas){
                this.canvasHeight = event.clientY + document.body.scrollTop;
            }
        },
        onTouchMove(event){
            if(this.resizingCanvas){
                const touch = event.touches.item(0);
                this.canvasHeight = touch.clientY + document.body.scrollTop;
            }
        },
        startResizingInput(event){
            event.preventDefault();
            this.resizingInput = true;
        },
        startResizingCanvas(event){
            event.preventDefault();
            this.resizingCanvas = true;
        },
        onMouseUp(){
            this.stopResizingInput();
            this.stopResizingCanvas();
        },
        onMouseLeave(){
            this.stopResizingInput();
            this.stopResizingCanvas();
        },
        stopResizingInput(){
            if(!this.resizingInput){
                return;
            }
            this.resizingInput = false;
            this.saveSettings();
        },
        onTouchEnd(){
            this.stopResizingCanvas();
        },
        stopResizingCanvas(){
            if(!this.resizingCanvas){
                return;
            }
            this.resizingCanvas = false;
            this.saveSettings();
        },
        onCanvasExecuted(result){
            this.hasRunInitially = true;
            this.error = result.error;
            this.running = false;
        },
        onCanvasError(error){
            this.error = error;
        },
        saveSettings(){
            const {width, height, units, rotationEnabled, greedyGestureHandling} = this.inputHeaderValues;
            settingsRepository.setSettings({
                width,
                height,
                units,
                rotationEnabled,
                greedyGestureHandling,
                isHorizontal: this.isHorizontal,
                inputContainerWidth: this.inputContainerWidth,
                canvasHeight: this.canvasHeight
            });
        },
        run(){
            this.running = true;
            this.instruction = {
                code: this.code,
                width: this.inputHeaderValues.width,
                height: this.inputHeaderValues.height,
                units: this.inputHeaderValues.units,
                greedyGestureHandling: this.inputHeaderValues.greedyGestureHandling,
                rotationEnabled: this.inputHeaderValues.rotationEnabled
            };
        },
        createAdditionalConfig(){
            return {
                units: this.inputHeaderValues.units,
                greedyGestureHandling: this.inputHeaderValues.greedyGestureHandling,
                rotationEnabled: this.inputHeaderValues.rotationEnabled
            };
        },
        onEditorChange(code){
            this.code = code;
            this.error = undefined;
        },
        onEditorBlur(){
            codeRepository.setCode(this.code);
        },
        dockBottom(){
            this.isHorizontal = true;
            this.saveSettings();
        },
        dockRight(){
            this.isHorizontal = false;
            this.saveSettings();
        },
        onInputHeaderValuesChanged(values){
            const oldAdditionalConfig = this.createAdditionalConfig();
            this.inputHeaderValues = values;
            this.saveSettings();
            const newAdditionalConfig = this.createAdditionalConfig();
            if(oldAdditionalConfig.units === newAdditionalConfig.units &&
                oldAdditionalConfig.greedyGestureHandling === newAdditionalConfig.greedyGestureHandling &&
                oldAdditionalConfig.rotationEnabled === newAdditionalConfig.rotationEnabled){
                    return;
            }
            this.additionalConfig = newAdditionalConfig;
        },
        onSyncCanvasSize(){
            this.useCanvasSize(this.lastKnownCanvasSize);
        },
        onCanvasSizeKnown(size){
            this.lastKnownCanvasSize = size;
            if(this.hasRunInitially){
                return;
            }
            this.run();
        },
        useCanvasSize(size){
            this.inputHeaderValues = {
                width: size.width,
                height: size.height,
                units: this.inputHeaderValues.units,
                greedyGestureHandling: this.inputHeaderValues.greedyGestureHandling,
                rotationEnabled: this.inputHeaderValues.rotationEnabled
            };
            this.saveSettings();
        }
    },
    computed: {
        inputContainerWidthStyle(){
            return (this.inputContainerWidth - 3) + 'px';
        },
        canvasContainerWidthStyle(){
            return `calc(100% - ${this.inputContainerWidthStyle})`;
        },
        dividerRightStyle(){
            return `${this.inputContainerWidth - 3}px`;
        },
        canvasHeightStyle(){
            return this.canvasHeight + 'px';
        },
        inputDisabled(){
            return this.running;
        },
        errorMessage(){
            return this.error && this.error.message;
        },
        errorRange(){
            return this.error && this.error.range;
        }
    },
    components: {
        'code-editor': {
            template: document.getElementById('codeEditorTemplate').innerHTML,
            data: function(){
                return {
                    editor: undefined,
                    errorRangeId: undefined
                };
            },
            props:{
                code: String,
                errorrange: Object
            },
            watch: {
                errorrange(value){
                    if(this.errorRangeId !== undefined){
                        this.editor.session.removeMarker(this.errorRangeId);
                        this.errorRangeId = undefined;
                    }
                    if(value){
                        const range = new ace.Range(value.startRow, value.startColumn, value.endRow, value.endColumn);
                        this.errorRangeId = this.editor.session.addMarker(range, 'error-marker', 'text', false);
                    }
                }
            },
            mounted: function(){
                const codeDiv = this.$refs.code;
                const editor = ace.edit(codeDiv);
                editor.session.setMode("ace/mode/javascript");
                editor.setValue(this.code);
                editor.clearSelection();
                editor.on('change', () => {
                    this.$emit('change', editor.getValue())
                });
                editor.on('blur', () => {
                    this.$emit('blur');
                });
                this.editor = editor;
            }
        },
        'infinite-canvas': {
            template: document.getElementById('infiniteCanvasTemplate').innerHTML,
            data: function(){
                return {
                    hasInitialized: false,
                    hasExecuted: false,
                    iframeContentWindow: undefined
                };
            },
            props: {
                instruction: Object,
                additionalconfig: Object
            },
            watch: {
                instruction(value){
                    if(this.hasExecuted){
                        this.iframeContentWindow.location.reload();
                    }else if(this.hasInitialized){
                        this.iframeContentWindow.postMessage({type: 'instruction', instruction: value});
                    }
                },
                additionalconfig(value){
                    if(!value){
                        return;
                    }
                    this.iframeContentWindow.postMessage({type: 'additionalConfig', additionalConfig: value});
                }
            },
            mounted: async function(){
                const iframe = this.$refs.iframe;
                const emitSize = () => {
                    const rect = iframe.getBoundingClientRect();
                    this.$emit('sizeknown', {width: rect.width * devicePixelRatio, height: rect.height * devicePixelRatio});
                };
                const observer = new ResizeObserver(() => {
                    emitSize(); 
                });
                observer.observe(iframe);
                iframe.setAttribute('sandbox','allow-scripts allow-same-origin');
                emitSize();
                iframe.src = await canvasIframeUrlPromise;
                this.iframeContentWindow = iframe.contentWindow;
                addEventListener('message', (event) => {
                    if(event.source !== iframe.contentWindow){
                        return;
                    }
                    const data = event.data;
                    if(data.type === 'loaded'){
                        this.hasInitialized = true;
                        if(this.instruction){
                            this.iframeContentWindow.postMessage({type: 'instruction', instruction: this.instruction});
                        }
                    }else if(data.type === 'executed'){
                        const result = data.result;
                        this.hasExecuted = true;
                        this.$emit('executed', result);
                    }else if(data.type === 'error'){
                        const error = data.error;
                        this.$emit('canvaserror', error)
                    }
                });
            }
        },
        'input-header': {
            template: document.getElementById('inputHeaderTemplate').innerHTML,
            props: {
                disabled: Boolean,
                running: Boolean,
                ishorizontal: Boolean,
                issmallwidth: Boolean,
                errormessage: String,
                headervalues: Object
            },
            data: function(){
                return {
                    _width: undefined,
                    _height: undefined,
                    canvasUnits: Units.CANVAS,
                    cssUnits: Units.CSS,
                    _chosenUnits: undefined,
                    _rotationEnabled: undefined,
                    _greedyGestureHandling: undefined
                };
            },
            mounted: function(){
                if(this.headervalues){
                    this.useHeaderValues(this.headervalues);
                }
            },
            computed: {
                width: {
                    get(){
                        return this.$data._width;
                    },
                    set(value){
                        this.$data._width = value;
                        this.emitHeaderValuesChanged();
                    }
                },
                height: {
                    get(){
                        return this.$data._height;
                    },
                    set(value){
                        this.$data._height = value;
                        this.emitHeaderValuesChanged();
                    } 
                },
                chosenUnits: {
                    get(){
                        return this.$data._chosenUnits;
                    },
                    set(value){
                        this.$data._chosenUnits = value;
                        this.emitHeaderValuesChanged();
                    } 
                },
                rotationEnabled: {
                    get(){
                        return this.$data._rotationEnabled;
                    },
                    set(value){
                        this.$data._rotationEnabled = value;
                        this.emitHeaderValuesChanged();
                    } 
                },
                greedyGestureHandling: {
                    get(){
                        return this.$data._greedyGestureHandling;
                    },
                    set(value){
                        this.$data._greedyGestureHandling = value;
                        this.emitHeaderValuesChanged();
                    } 
                }
            },
            watch: {
                headervalues(value){
                    this.useHeaderValues(value);
                }
            },
            methods: {
                onRunClicked(){
                    this.$emit('runclicked')
                },
                onDockRightClicked(){
                    this.$emit('dockrightclicked')
                },
                onDockBottomClicked(){
                    this.$emit('dockbottomclicked')
                },
                emitHeaderValuesChanged(){
                    this.$emit('headervalueschanged', {
                        width: this.$data._width,
                        height: this.$data._height,
                        units: this.$data._chosenUnits,
                        greedyGestureHandling: this.$data._greedyGestureHandling,
                        rotationEnabled: this.$data._rotationEnabled
                    })
                },
                useHeaderValues(values){
                    if(!values || values.width === this.$data._width &&
                        values.height === this.$data._height &&
                        values.units === this.$data._chosenUnits &&
                        values.greedyGestureHandling === this.$data._greedyGestureHandling &&
                        values.rotationEnabled === this.$data._rotationEnabled){
                        return;
                    }
                    this.$data._width = values.width,
                    this.$data._height = values.height,
                    this.$data._chosenUnits = values.units;
                    this.$data._greedyGestureHandling = values.greedyGestureHandling;
                    this.$data._rotationEnabled = values.rotationEnabled;
                },
                onSyncSizeClicked(){
                    this.$emit('syncsizeclicked');
                }
            }
        }
    }
})