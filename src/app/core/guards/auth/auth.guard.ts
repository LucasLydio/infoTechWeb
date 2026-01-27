import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    console.log(this.auth.isAuthenticated())
    if (this.auth.isAuthenticated()) {
      return true;
    }
    // Redireciona para a tela de login se não estiver autenticado
    return this.router.createUrlTree(['/auth']);
  }
}
