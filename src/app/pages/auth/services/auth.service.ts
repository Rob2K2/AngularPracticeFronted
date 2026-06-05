import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as authActions from '@auth/auth.actions';

import { User } from '../../../models/user';

import {
  AuthResponse,
  MockUserRecord,
  RegisterResponse,
} from '../interfaces/interfaces';

const MOCK_CREDENTIALS = { username: 'demo', password: 'demo' };
const MOCK_USERS_KEY = 'mock-users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<boolean | string> {
    const trimmedUsername = username.trim();

    if (environment.useMockAuth) {
      return this.loginWithMock(trimmedUsername, password);
    }

    const url = `${this.baseUrl}/auth`;
    const body = { username: trimmedUsername, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.persistSession(resp);
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  register(payload: {
    username: string;
    email: string;
    password: string;
  }): Observable<boolean | string> {
    const trimmedUsername = payload.username.trim();
    const trimmedEmail = payload.email.trim();

    if (environment.useMockAuth) {
      return this.registerWithMock({
        username: trimmedUsername,
        email: trimmedEmail,
        password: payload.password,
      });
    }

    const url = `${this.baseUrl}/register`;
    const body = {
      username: trimmedUsername,
      email: trimmedEmail,
      password: payload.password,
    };

    return this.http.post<RegisterResponse>(url, body).pipe(
      map((resp) => (resp.ok ? true : resp.msg ?? 'Could not create account')),
      catchError((err) => of(err.error?.msg ?? 'Could not create account'))
    );
  }

  validateAuth(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }

    if (environment.useMockAuth) {
      const isValid = this.isLoggedIn();
      if (!isValid) {
        this.logout();
      }
      return of(isValid);
    }

    return this.http.get<AuthResponse>(`${this.baseUrl}/validate`).pipe(
      tap((resp) => {
        if (resp.ok) {
          this.persistSession(resp);
        }
      }),
      map((resp) => resp.ok),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  logout() {
    const mockUsers = localStorage.getItem(MOCK_USERS_KEY);
    localStorage.clear();
    if (mockUsers) {
      localStorage.setItem(MOCK_USERS_KEY, mockUsers);
    }
    this.store.dispatch(authActions.unSetUser());
  }

  logoutAndRedirect(): void {
    this.logout();
    this.router.navigateByUrl('/sign-in');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token || !localStorage.getItem('user')) {
      return false;
    }

    if (environment.useMockAuth) {
      return this.isMockTokenValid(token);
    }

    return true;
  }

  restoreSession(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this._user = user;
        this.store.dispatch(authActions.setUser({ user }));
        return;
      } catch {
        localStorage.removeItem('user');
      }
    }

    this.logout();
  }

  private isMockTokenValid(token: string): boolean {
    if (token === 'mock-dev-token') {
      return true;
    }

    if (token.startsWith('mock-token-')) {
      const username = token.slice('mock-token-'.length);
      return !!this.findMockUser(username);
    }

    return false;
  }

  private loginWithMock(
    username: string,
    password: string
  ): Observable<boolean | string> {
    return of({ username, password }).pipe(
      delay(800),
      map(({ username, password }) => {
        if (
          username === MOCK_CREDENTIALS.username &&
          password === MOCK_CREDENTIALS.password
        ) {
          this.persistSession(this.buildDemoAuthResponse());
          return true;
        }

        const registeredUser = this.findMockUser(username);
        if (registeredUser && registeredUser.password === password) {
          this.persistSession(this.buildAuthResponseFromMockUser(registeredUser));
          return true;
        }

        return `Invalid credentials. In demo mode use ${MOCK_CREDENTIALS.username} / ${MOCK_CREDENTIALS.password}`;
      })
    );
  }

  private registerWithMock(payload: {
    username: string;
    email: string;
    password: string;
  }): Observable<boolean | string> {
    return of(payload).pipe(
      delay(800),
      map(({ username, email, password }) => {
        if (username === MOCK_CREDENTIALS.username) {
          return 'That username is already taken';
        }

        if (this.findMockUser(username)) {
          return 'That username is already taken';
        }

        const mockUser: MockUserRecord = {
          username,
          password,
          email,
          registerDate: new Date().toISOString(),
        };

        this.saveMockUser(mockUser);
        return true;
      })
    );
  }

  private getMockUsers(): MockUserRecord[] {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as MockUserRecord[];
    } catch {
      return [];
    }
  }

  private findMockUser(username: string): MockUserRecord | undefined {
    return this.getMockUsers().find((user) => user.username === username);
  }

  private saveMockUser(user: MockUserRecord): void {
    const users = this.getMockUsers();
    users.push(user);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private ensureDemoUser(): MockUserRecord {
    const existing = this.findMockUser(MOCK_CREDENTIALS.username);
    if (existing) {
      return existing;
    }

    const demoUser: MockUserRecord = {
      username: MOCK_CREDENTIALS.username,
      password: MOCK_CREDENTIALS.password,
      email: 'demo@local.dev',
      registerDate: new Date().toISOString(),
    };

    this.saveMockUser(demoUser);
    return demoUser;
  }

  private buildDemoAuthResponse(): AuthResponse {
    return this.buildAuthResponseFromMockUser(this.ensureDemoUser());
  }

  private buildAuthResponseFromMockUser(user: MockUserRecord): AuthResponse {
    return {
      ok: true,
      token:
        user.username === MOCK_CREDENTIALS.username
          ? 'mock-dev-token'
          : `mock-token-${user.username}`,
      username: user.username,
      email: user.email,
      registerDate: user.registerDate,
    };
  }

  private persistSession(resp: AuthResponse): void {
    localStorage.setItem('token', resp.token!);
    this._user = {
      username: resp.username!,
      email: resp.email!,
      registerDate: resp.registerDate!,
    };
    localStorage.setItem('user', JSON.stringify(this._user));
    this.store.dispatch(authActions.setUser({ user: this._user }));
  }
}
