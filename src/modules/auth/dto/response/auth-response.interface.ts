export interface IAuthResponse {
  accessToken: string;
  user: IUserResponse;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
}
