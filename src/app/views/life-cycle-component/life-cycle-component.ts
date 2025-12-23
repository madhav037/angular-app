import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  contentChild,
  DoCheck,
  ElementRef,
  EventEmitter,
  input,
  OnDestroy,
  OnInit,
  Output,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-life-cycle-component',
  imports: [],
  templateUrl: './life-cycle-component.html',
  styleUrl: './life-cycle-component.css',
})
export class LifeCycleComponent
  implements
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  username = input<string>('');

  // reply = output<EventEmitter<string>>();
  @Output() reply = new EventEmitter<string>();

  parentElement = contentChild<ElementRef>('parentContent');
  viewBox = viewChild<ElementRef>('viewChildBox');

  private oldusername: string = '';
  private interval: any;
  resizeCount: number = 0;

  constructor() {
    console.log('Constructor: Component is being constructed');
  }

  notifyParent() {
    this.reply.emit(`Hello from LifeCycleComponent, ${this.username()}`);
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit: Content has been initialized');
    if (this.parentElement()) {
      console.log('Parent content element:', this.parentElement()?.nativeElement.textContent);
      if (this.parentElement() && this.parentElement()?.nativeElement) {
        this.parentElement()!.nativeElement.style.color = 'blue';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: ', changes);
    if (changes['username']) {
      const previousValue = changes['username'].previousValue;
      const currentValue = changes['username'].currentValue;
      console.log(`Username changed from ${previousValue} to ${currentValue}`);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit: Component has been initialized');
    this.interval = setInterval(() => {
      this.resizeCount++;
    }, 1000);
  }

  ngDoCheck(): void {
    console.log('ngDoCheck: Change detection is running');
    if (this.username() !== this.oldusername) {
      console.log(`Username changed from ${this.oldusername} to ${this.username()}`);
      this.oldusername = this.username();
    }
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked: Content has been checked');
  }

  ngAfterViewInit(): void {
    this.viewBox()!.nativeElement.style.background = 'red';
    console.log('ngAfterViewInit: View has been initialized');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked: View has been checked');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy: Component is being destroyed');
    clearInterval(this.interval);
  }
}
