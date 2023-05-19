import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styles: [
  ]
})
export class ConnexionComponent {

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['home/login']);
    console.log(['navigate ouuuuu'])
  }
}
