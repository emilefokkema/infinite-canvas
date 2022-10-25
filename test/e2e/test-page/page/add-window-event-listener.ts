import { WithFunctionsAsStrings } from "../utils";
import { EventListenerConfiguration } from "../shared/configuration";
import { EventListenerOnE2ETestPage } from "./interfaces";
import { WindowEventMap } from '../shared/window-event-map';
import { AttachedEventListener } from './attached-event-listener';

export function addWindowEventListener<Type extends keyof WindowEventMap>(config: WithFunctionsAsStrings<EventListenerConfiguration<WindowEventMap, Type>>): EventListenerOnE2ETestPage<WindowEventMap[Type]>{
    return new AttachedEventListener(window, config);
}