import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `

  <div class="flex justify-center">
      <h2 class="text-orange-300 text-2xl">{{ username }}</h2>
  </div>

    <app-calendar-streak></app-calendar-streak>
  `,
  styles: [
  ]
})
export class ProfileComponent {
  username = localStorage['username']

  ngOnInit() {
    console.log(this.username);
    
  }

}
