export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}
