import { MouseEventImpl } from "./mouse-event-impl";

export class DragEventImpl extends MouseEventImpl<DragEvent> implements DragEvent{
    public get dataTransfer(): DataTransfer | null{
        return this.event.dataTransfer;
    }
}