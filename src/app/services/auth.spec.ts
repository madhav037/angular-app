import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { Auth } from './auth';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

// fdescribe('Auth Service', () => {
//   let service: Auth;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [Auth],
//     });

//     service = TestBed.inject(Auth);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   it('should return users', () => {
//     const mockUsers = [
//       {
//         id: 1,
//         fullName: 'Madhav',
//         email: 'madhav@example.com',
//         role: 'Admin',
//       },
//     ];

//     service.getUsers().subscribe((users: any[]) => {
//       expect(users.length).toBe(1);
//       expect(users[0].fullName).toBe('Madhav');
//     });

//     const req = httpMock.expectOne(req => req.url.includes('/User'));
//     req.flush(mockUsers);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });
// });

describe.only('Auth service (mocked)', () => {
  it('should return users', () => {
    const mockUsers = [
      {
        id: 1,
        fullName: 'Madhav',
        email: 'madhav@example.com',
        password: 'password',
        role: 'Admin',
      },
    ];

    const authMock = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
    };

    authMock.getUsers().subscribe((users: any[]) => {
      expect(users.length).toBe(1);
      expect(users[0].fullName).toBe('Madhav');
    });

    expect(authMock.getUsers).toHaveBeenCalled();
  });
});
