import { Directive, Input, ElementRef, Renderer2, OnInit } from "@angular/core";
import { DomController } from "@ionic/angular";

@Directive({
  selector: "[myScrollVanish]"
})
export class ScrollVanishDirective implements OnInit {
  @Input("myScrollVanish") scrollArea;

  private hidden: boolean = false;
  private triggerDistance: number = 20;
  private lastDeltaY: number = 0;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe(scrollEvent => {
      let delta = scrollEvent.detail.deltaY;
      console.log(delta);

      if (delta < this.lastDeltaY) {
        this.show();
        this.lastDeltaY = delta;
        return;
      } else if (!this.hidden && delta > this.lastDeltaY){
        this.hide();
        this.lastDeltaY = delta;
      }
      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show();
      }
      this.lastDeltaY = delta;
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        "transition",
        "0.2s linear"
      );
      this.renderer.setStyle(this.element.nativeElement, "height", "auto");
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "min-height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "opacity", "0");
      this.renderer.setStyle(this.element.nativeElement, "padding", "0");
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "height", "auto");
      this.renderer.removeStyle(this.element.nativeElement, "opacity");
      this.renderer.removeStyle(this.element.nativeElement, "min-height");
      this.renderer.removeStyle(this.element.nativeElement, "padding");
    });

    this.hidden = false;
  }
}
