import { Component, Injectable } from '@angular/core';
import { InputComponent } from '../component/input/input.component';
import { Observable, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged: boolean = false;
  redirectUrl: InputComponent | undefined

  login(emailOrUsername: string, password: string): Observable<boolean> {
    const isLogged = (emailOrUsername == 'mathis' && password == 'Mathis10')

    return of(isLogged).pipe(
      delay(1000),
      tap(isLogged => this.isLogged = isLogged)
    );

    console.log(isLogged);
    
  }

  logout() {

  }
}
