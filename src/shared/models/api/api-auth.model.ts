export interface ApiUserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiCredentialsModel {
  accessToken: string;
  refreshToken: string;
  accessExp: string;
  refreshExp: string;
  accessExpMS: number;
  refreshExpMS: number;
}

export interface ApiAuthModel {
  user: ApiUserModel;
  credentials: ApiCredentialsModel;
}

export interface ApiUserIdModel {
  userId: string;
}
