import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsers } from './manage-users';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../../injection.token';

describe('ManageUsers', () => {
  let component: ManageUsers;
  let fixture: ComponentFixture<ManageUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUsers],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
        {
          provide: APP_CONFIG,
          useValue: {
            apiUrl: 'http://localhost:5000/api',
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
