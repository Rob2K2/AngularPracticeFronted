import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { AppState } from '../../../app.reducer';

describe('AuthService (mock auth)', () => {
  let service: AuthService;
  let store: jasmine.SpyObj<Store<AppState>>;

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Store, useValue: store },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigateByUrl']),
        },
      ],
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should log in with demo credentials', fakeAsync(() => {
    let result: boolean | string | undefined;

    service.login('demo', 'demo').subscribe((response) => {
      result = response;
    });

    tick(800);

    expect(result).toBeTrue();
    expect(localStorage.getItem('token')).toBe('mock-dev-token');
    expect(localStorage.getItem('user')).toContain('"username":"demo"');
    expect(store.dispatch).toHaveBeenCalled();
  }));

  it('should trim the username before logging in', fakeAsync(() => {
    let result: boolean | string | undefined;

    service.login('demo ', 'demo').subscribe((response) => {
      result = response;
    });

    tick(800);

    expect(result).toBeTrue();
  }));

  it('should reject invalid credentials', fakeAsync(() => {
    let result: boolean | string | undefined;

    service.login('demo', 'wrong-password').subscribe((response) => {
      result = response;
    });

    tick(800);

    expect(result).not.toBeTrue();
    expect(localStorage.getItem('token')).toBeNull();
  }));

  it('should reject a token without a stored user', () => {
    localStorage.setItem('token', 'mock-dev-token');

    let isValid = true;
    service.validateAuth().subscribe((response) => {
      isValid = response;
    });

    expect(isValid).toBeFalse();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should accept a valid mock session', () => {
    localStorage.setItem('token', 'mock-dev-token');
    localStorage.setItem(
      'user',
      JSON.stringify({
        username: 'demo',
        email: 'demo@local.dev',
        registerDate: '2020-01-01T00:00:00.000Z',
      })
    );

    let isValid = false;
    service.validateAuth().subscribe((response) => {
      isValid = response;
    });

    expect(isValid).toBeTrue();
  });
});
