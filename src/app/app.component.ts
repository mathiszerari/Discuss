import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="mx-40 pt-10 h-10 min-h-screen">
    <app-title></app-title>

    <app-question></app-question>

    <app-input></app-input>

    <app-reponses></app-reponses> 
  </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'ng-discuss-app';
}
