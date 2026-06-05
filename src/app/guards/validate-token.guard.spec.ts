import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ValidateTokenGuard } from './validate-token.guard';
import { AuthService } from '@auth/services/auth.service';

describe('ValidateTokenGuard', () => {
  let guard: ValidateTokenGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['validateAuth']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ValidateTokenGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(ValidateTokenGuard);
  });

  it('should allow access when the session is valid', (done) => {
    authService.validateAuth.and.returnValue(of(true));

    guard.canActivate().subscribe((allowed) => {
      expect(allowed).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to sign-in when the session is invalid', (done) => {
    authService.validateAuth.and.returnValue(of(false));

    guard.canActivate().subscribe((allowed) => {
      expect(allowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
      done();
    });
  });

  it('should use the same check for lazy-loaded routes', (done) => {
    authService.validateAuth.and.returnValue(of(true));

    guard.canLoad().subscribe((allowed) => {
      expect(allowed).toBeTrue();
      expect(authService.validateAuth).toHaveBeenCalled();
      done();
    });
  });
});
