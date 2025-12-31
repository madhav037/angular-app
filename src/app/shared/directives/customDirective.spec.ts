import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CustomDirective } from './customDirective';

@Component({
  template: `
    <ng-container *appCustomDirective="condition">
      <p id="content">Hello World</p>
    </ng-container>
  `,
  standalone: true,
  imports: [CustomDirective],
})
class TestHostComponent {
  condition = false;
}

describe('CustomDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should not render content when condition is false', () => {
    component.condition = false;
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('#content'));
    expect(content).toBeNull();
  });

  it('should render content when condition is true', () => {
    component.condition = true;
    fixture.detectChanges();

    const content = fixture.debugElement.query(By.css('#content'));
    expect(content).toBeTruthy();
  });
});
