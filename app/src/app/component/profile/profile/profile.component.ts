import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `

  
    <app-title></app-title>

    <app-infos></app-infos>

    <app-calendar-streak></app-calendar-streak>
  `,
  styles: [
  ]
})
export class ProfileComponent {
  username = localStorage['username']

  ngOnInit() {
    console.log(this.username);
    console.log(localStorage);
  }

}
