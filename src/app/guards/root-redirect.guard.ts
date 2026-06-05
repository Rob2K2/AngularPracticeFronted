import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RootRedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): UrlTree {
    return this.authService.isLoggedIn()
      ? this.router.createUrlTree(['/home'])
      : this.router.createUrlTree(['/sign-in']);
  }
}
