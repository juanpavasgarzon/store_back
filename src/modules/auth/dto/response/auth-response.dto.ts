import type { IAuthResponse, IUserResponse } from './auth-response.interface';

export class AuthUserResponse implements IUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];

  constructor(data: IUserResponse) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.permissions = data.permissions;
  }
}

export class AuthResponseDto implements IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;

  constructor(data: IAuthResponse) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.user = new AuthUserResponse(data.user);
  }
}
