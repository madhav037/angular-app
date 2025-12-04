import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentLifeCycleComponent } from './parent-life-cycle-component';

describe('ParentLifeCycleComponent', () => {
  let component: ParentLifeCycleComponent;
  let fixture: ComponentFixture<ParentLifeCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentLifeCycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentLifeCycleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
