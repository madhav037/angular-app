import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCustomDirective]',
  standalone: true,
})
export class CustomDirective {
  constructor(private template: TemplateRef<any>, private view: ViewContainerRef) {}

  @Input() set appCustomDirective(condition: boolean) {
    console.log('CustomDirective condition:', condition);
    if (condition) {
      this.view.createEmbeddedView(this.template);
    } else {
      this.view.clear();
    }
  }
}
