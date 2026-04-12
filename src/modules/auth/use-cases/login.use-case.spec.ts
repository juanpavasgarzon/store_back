import { LoginUseCase } from './login.use-case';
import type { IUser } from '../../../shared';

describe('LoginUseCase', () => {
  const user: IUser = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    role: 'user',
  };

  it('returns access token, refresh token, and user data', async () => {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const buildPayload = jest.fn().mockReturnValue(payload);
    const signToken = jest.fn().mockResolvedValue('access-token');
    const createRefreshToken = jest.fn().mockResolvedValue('refresh-token');

    const authService = { buildPayload, signToken } as never;
    const createRefreshTokenUseCase = { execute: createRefreshToken } as never;

    const loginUseCase = new LoginUseCase(authService, createRefreshTokenUseCase);
    const result = await loginUseCase.execute(user);

    expect(buildPayload).toHaveBeenCalledWith(user);
    expect(signToken).toHaveBeenCalledWith(payload);
    expect(createRefreshToken).toHaveBeenCalledWith(user.id);
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  });
});
