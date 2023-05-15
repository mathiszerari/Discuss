import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-title></app-title>

    <app-question></app-question>

    <app-input></app-input>

    <app-reponses></app-reponses> 

    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'ng-discuss-app';
}
