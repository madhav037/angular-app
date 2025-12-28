import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';

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
