import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registeration } from './registeration';
import { ActivatedRoute } from '@angular/router';
import { APP_CONFIG } from '../../injection.token';

describe('Registeration', () => {
  let component: Registeration;
  let fixture: ComponentFixture<Registeration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registeration],
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

    fixture = TestBed.createComponent(Registeration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
