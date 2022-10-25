import { EventListenerOnE2ETestPage, EventListenerSequenceOnE2ETestPage } from "./interfaces";
import { WithFunctionsAsStrings } from "../utils";
import { EventListenerConfiguration } from "../shared/configuration";
import { EventTarget } from './event-target';
import { TypedEventSource } from './typed-event-source';
import { debounce } from "./debounce";
import { EventSource } from "./event-source";
import { Dispatcher } from "./dispatcher";
import { getShapeFromObject } from './get-shape-from-object';
import { EventListenerSequence } from './event-listener-sequence';
import { AsyncResult } from './async-result';

export class AttachedEventListener<TEventMap, TType extends keyof TEventMap> implements EventListenerOnE2ETestPage<TEventMap[TType]>{
   private preventDefault: (ev: TEventMap[TType]) => boolean;
   private shape: TEventMap[TType];
   private dispatcher: Dispatcher<TEventMap[TType]> = new Dispatcher();
   constructor(private readonly target: EventTarget<TEventMap>, config: WithFunctionsAsStrings<EventListenerConfiguration<TEventMap, TType>>){
      const {type, preventDefault, shape, debounceInterval} = config;
      let source: EventSource<TEventMap[TType]> = new TypedEventSource(target, <TType>type);
      if(debounceInterval !== undefined){
         source = debounce(source, debounceInterval);
      }
      source.addListener((e) => this.handleEvent(e));
      this.preventDefault = preventDefault ? eval(preventDefault) : undefined;
      this.shape = <TEventMap[TType]>shape;
   }
   private handleEvent(ev: TEventMap[TType]): void{
      if(this.preventDefault && this.preventDefault(ev)){
          (<any>ev).preventDefault();
      }
      if(this.dispatcher.listeners.length === 0){
          return;
      }
      const eventShape = getShapeFromObject(this.shape, ev);
      this.dispatcher.dispatch(<TEventMap[TType]><unknown>eventShape);
   }
   public addListener(listener: (ev: TEventMap[TType]) => void): void{
      this.dispatcher.addListener(listener);
   }
   public removeListener(listener: (ev: TEventMap[TType]) => void): void{
      this.dispatcher.removeListener(listener);
   }
   public startSequence(): EventListenerSequenceOnE2ETestPage{
      return new EventListenerSequence(this);
   }
   public getNext(): AsyncResult<TEventMap[TType]>{
      return new AsyncResult(new Promise((res) => {
         const listener = (e: TEventMap[TType]) => {
            this.dispatcher.removeListener(listener);
            res(e);
         }
         this.dispatcher.addListener(listener);
      }));
   }
   public ensureNoNext(interval: number): AsyncResult{
      return new AsyncResult(new Promise((res, rej) => {
         const listener = (e: TEventMap[TType]) => {
             rej(new Error(`received unexpected event ${JSON.stringify(e)}`));
             this.dispatcher.removeListener(listener);
         };
         this.dispatcher.addListener(listener);
         setTimeout(() => {
             this.dispatcher.removeListener(listener);
             res();
         }, interval);
     }));
   }
}