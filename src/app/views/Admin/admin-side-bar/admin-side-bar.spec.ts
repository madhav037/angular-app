import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSideBar } from './admin-side-bar';
import { ActivatedRoute } from '@angular/router';

describe('AdminSideBar', () => {
  let component: AdminSideBar;
  let fixture: ComponentFixture<AdminSideBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSideBar],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
