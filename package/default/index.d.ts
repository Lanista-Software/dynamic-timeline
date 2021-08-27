interface Configuration {
    el: string | HTMLCanvasElement;
    timelineDuration?: number;
    lineWidth?: number;
    shortLineColor?: string;
    longLineColor?: string;
    textFillColor?: string;
    offsetLeft?: number;
    canvasHeight?: number;
}
interface TimelineConstants {
    width: number;
    ctx: CanvasRenderingContext2D | any;
    reRenderX: number;
    elmLeft: number;
    diffX: number;
    newElmLeft: number;
    isMouseDown: boolean;
    startTime: number;
    renderedSize: number;
    timelinePosition: number;
}
declare const defaultConfig: Configuration;
declare class DynamicTimeline {
    private config;
    private constants;
    constructor(userConfig: Configuration);
    init(): void;
    private query;
    private drawLineToCanvas;
    private fillTextToCanvas;
    mouseDown: (e: MouseEvent) => void;
    mouseUp(): void;
    mouseMove(e: MouseEvent): void;
    private alignTimeline;
}
declare const dynamicTimeline: DynamicTimeline;
//# sourceMappingURL=index.d.ts.map