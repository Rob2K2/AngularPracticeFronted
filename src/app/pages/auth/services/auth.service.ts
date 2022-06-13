import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as authActions from '@auth/auth.actions';

import { User } from '../../../models/user';

import { AuthResponse } from '../interfaces/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _user!: User;
  
  constructor(private http: HttpClient, private store: Store<AppState>) {}

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
            name: resp.name!,
            lastname: resp.lastname!,
            registerDate: resp.registerDate!,
            userImage: resp.userImage!,
          };
          // Add logged user to Store
          this.store.dispatch(authActions.setUser({ user: this._user }));
        }
      }),
      map((resp) => resp.ok),
      catchError((err) => of(err.error.msg))
    );
  }

  validateToken() {
    return true;
  }

  validateAuth(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false);
    }

    return of(true);
  }

  logout() {
    localStorage.clear();
    // Remove logged user from Store
    this.store.dispatch(authActions.unSetUser());
  }
}
