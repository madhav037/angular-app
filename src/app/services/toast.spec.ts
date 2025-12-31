import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    (window as any).bootstrap = {
      Toast: function () {
        return {
          show: jasmine.createSpy('show'),
        };
      },
    };

    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);

    const container = document.createElement('div');
    container.id = 'global-toast-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    const container = document.getElementById('global-toast-container');
    container?.remove();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create and append toast to container', () => {
    service.show('Hello World', 'success');

    const container = document.getElementById('global-toast-container');
    const toast = container?.querySelector('.toast');

    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Hello World');
    expect(toast?.classList.contains('text-success')).toBeTrue();
  });

  xit('should remove toast when hidden event is triggered', () => {
    service.show('Remove Test', 'warning');

    const container = document.getElementById('global-toast-container');
    const toast = container?.querySelector('.toast') as HTMLElement;

    expect(container?.children.length).toBe(1);

    toast.dispatchEvent(new Event('hidden.bs.toast'));

    expect(container?.children.length).toBe(0);
  });
});
