import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { AuthResponse, User } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const url = `${this.baseUrl}/auth`;
    const body = { username, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          this._user = {
            username: resp.username!,
            email: resp.email!,
            name:resp.name!,
            lastname: resp.lastname!,
            registerDate: resp.registerDate!,
            userImage: resp.userImage!,
          };
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  validateToken() {
    return true;
  }

  validateAuth(): Observable<boolean>  {
    if (!localStorage.getItem('token')) {
      return of(false);
    }

    return of(true);
  }

  logout() {
    localStorage.clear();
  }
}
