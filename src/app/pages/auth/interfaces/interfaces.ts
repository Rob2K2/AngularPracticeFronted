export interface AuthResponse {
  ok: boolean;
  username?: string;
  email?: string;
  name?: string;
  lastname?: string;
  registerDate?: string;
  userImage?: string;
  token?: string;
  msg?: string;
}

export interface User {
  username: string;
  email: string;
  name: string;
  lastname: string;
  registerDate: string;
  userImage: string;
}
