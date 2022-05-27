import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidateTokenGuard implements CanActivate, CanLoad {
constructor(private authService: AuthService){}

  canActivate(): Observable<boolean> | boolean {
    console.log('canActivate')
    return this.authService.validateToken()
  }
  canLoad(): Observable<boolean> | boolean {
    console.log('canLoad')
    return this.authService.validateToken();
  }
}
