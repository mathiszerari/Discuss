import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
    
  canActivate(): boolean {
    if (this.authService.isLogged) {
      return true;
    } else {
      return false;
      // this.router.navigate[ConnexionComponent]
    }

    // console.log('guard call');
    
    return true;
  }
  
}
