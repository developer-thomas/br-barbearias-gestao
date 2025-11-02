export type SigninCredentials = {
  credential: string;
  password: string;
};

export type SigninCredentialsResponse = {
  token?: string;
  user?: any;
};
