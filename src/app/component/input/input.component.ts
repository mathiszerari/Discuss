import { Component } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent {
  reponse: string;

  constructor() {
    this.reponse = '';
  }
}
