export interface AuthResponse {
  ok: boolean;
  username?: string;
  email?: string;
  token?: string;
  msg?: string;
}

export interface User {
  username: string;
  email: string;
}
