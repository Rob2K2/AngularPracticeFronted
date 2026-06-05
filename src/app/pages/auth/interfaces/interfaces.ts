export interface AuthResponse {
  ok: boolean;
  username?: string;
  email?: string;
  registerDate?: string;
  token?: string;
  msg?: string;
}

export interface RegisterResponse {
  ok: boolean;
  msg?: string;
}

export interface MockUserRecord {
  username: string;
  password: string;
  email: string;
  registerDate: string;
}
