import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <app-title></app-title>

    <app-question></app-question>

    <app-input></app-input>

    <app-connexion></app-connexion> 

    <app-reponses></app-reponses> 

    <app-footer></app-footer>
  `,
  styles: []
})
export class HomeComponent {
  //
}