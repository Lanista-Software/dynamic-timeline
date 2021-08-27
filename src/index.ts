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
const defaultConfig: Configuration = {
  el: "#dynamic-timeline",
  timelineDuration: 12000,
  lineWidth: 1,
  shortLineColor: "#668f80",
  longLineColor: "#a0af84",
  textFillColor: "#4a6670",
  offsetLeft: window.innerWidth / 2, // Nasıl olmalı ?
  canvasHeight: 100,
};

class DynamicTimeline {
  private config: Configuration = defaultConfig;
  private constants: TimelineConstants;
  constructor(userConfig: Configuration) {
    Object.assign(this.config, userConfig);
    this.constants = {
      width: 6000,
      ctx: "",
      reRenderX: 2000,
      elmLeft: 0,
      diffX: 0,
      newElmLeft: 0,
      isMouseDown: false,
      startTime: 0,
      renderedSize: 0,
      timelinePosition: 0,
    };
  }
  init() {
    const el = this.query(this.config.el);
    if (!(el instanceof HTMLCanvasElement)) {
      throw new Error(
        "[VideoEditingTimeline] element should be an instance of HTMLCanvasElement"
      );
    }
    el.width = this.constants.width;
    el.height = this.config.canvasHeight || 0;
    el.style.position = "absolute";
    el.style.left = this.config.offsetLeft + "px";
    el.style.zIndex = "1000";
    el.style.objectFit = "contain";
    el.style.scrollBehavior = "smooth";
    el.style.cursor = "pointer";
    el.style.overflow = "hidden";
    this.constants.ctx = el.getContext("2d");
    this.drawLineToCanvas();
    this.fillTextToCanvas(this.constants.startTime);
    document.addEventListener("mouseup", (e) => this.mouseUp());
    document.addEventListener("mousemove", (e) => this.mouseMove(e));
    el.addEventListener("mousedown", (e) => this.mouseDown(e));
  }

  private query(el: string | HTMLCanvasElement) {
    if (typeof el === "string") {
      var selected = document.querySelector(el);
      if (!selected) {
        throw new Error("[VideoEditingTimeline]: Cannot find element: " + el);
      }
      return selected;
    } else {
      return el;
    }
  }

  private drawLineToCanvas(): void {
    const canvasWidth = this.constants.width;
    const ctx = this.constants.ctx;
    for (let index = 0; index <= canvasWidth; index++) {
      if (index % 100 === 0) {
        ctx.moveTo(index, 100);
        ctx.lineTo(index, 70);
        ctx.stroke();
      }
      if (index % 50 === 0 && index % 100 !== 0) {
        ctx.moveTo(index, 100);
        ctx.lineTo(index, 80);
        ctx.stroke();
      }
      if (index % 25 === 0 && index % 50 !== 0 && index % 100 !== 0) {
        ctx.moveTo(index, 100);
        ctx.lineTo(index, 90);
        ctx.stroke();
      }
    }
  }
  private fillTextToCanvas(startTime: number) {
    const ctx = this.constants.ctx;
    const canvasWidth = this.constants.width;
    const duration = this.config.timelineDuration || startTime + 1;
    console.log(duration);

    ctx.clearRect(0, 0, canvasWidth, 51);
    ctx.beginPath();
    for (
      let index = 0;
      index <= canvasWidth && index + startTime <= duration;
      index++
    ) {
      if (index % 100 === 0) {
        ctx.font = "12px Arial";
        ctx.strokeText(index + startTime, index, 50);
      }
    }
  }
  public mouseDown = (e: MouseEvent) => {
    const ctx = this.constants.ctx;
    this.constants.isMouseDown = true;
    let mouseX = e.clientX;
    this.constants.elmLeft = ctx.canvas.offsetLeft;
    this.constants.diffX = mouseX - this.constants.elmLeft;
  };

  public mouseUp() {
    this.constants.isMouseDown = false;
    if (
      this.constants.width - this.constants.timelinePosition <=
      this.constants.reRenderX
    ) {
      this.constants.startTime += this.constants.reRenderX;
      this.constants.renderedSize += this.constants.reRenderX;
      this.fillTextToCanvas(this.constants.startTime);
      this.constants.newElmLeft =
        this.constants.newElmLeft + this.constants.reRenderX;
      this.alignTimeline();
    }
    if (
      this.constants.startTime != 0 &&
      this.constants.timelinePosition <= this.constants.reRenderX
    ) {
      this.constants.startTime -= this.constants.reRenderX;
      this.constants.renderedSize -= this.constants.reRenderX;

      this.fillTextToCanvas(this.constants.startTime);
      this.constants.newElmLeft =
        this.constants.newElmLeft - this.constants.reRenderX;

      this.alignTimeline();
    }
  }

  public mouseMove(e: MouseEvent) {
    let offsetLeft = this.config.offsetLeft || 0;
    let duration = this.config.timelineDuration || 0;
    if (e.movementX != 0) {
      if (!this.constants.isMouseDown) {
        return;
      }
      let newMouseX = e.clientX;
      this.constants.newElmLeft = newMouseX - this.constants.diffX;
      if (this.constants.newElmLeft < offsetLeft - this.constants.width) {
        this.constants.newElmLeft = offsetLeft - this.constants.width;
      }
      console.log(this.constants.newElmLeft, duration);

      if (this.constants.newElmLeft > duration) {
        this.constants.newElmLeft = duration;
      }
      if (this.constants.newElmLeft > offsetLeft) {
        this.constants.newElmLeft = offsetLeft;
      }
      this.alignTimeline();
      this.constants.timelinePosition = Math.abs(
        this.constants.newElmLeft - offsetLeft
      );
    }
  }
  private alignTimeline() {
    this.constants.ctx.canvas.style.left = this.constants.newElmLeft + "px";
  }
}

const dynamicTimeline = new DynamicTimeline({
  el: "#canvas",
  timelineDuration: 10000,
  lineWidth: 2,
});
dynamicTimeline.init();
