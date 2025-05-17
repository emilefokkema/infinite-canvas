export interface CanvasElementInitialization{
    styleWidth: string;
    styleHeight: string;
    canvasWidth: number | 'boundingclientrect';
    canvasHeight: number | 'boundingclientrect';
    spaceBelowCanvas?: number
}