import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styles: []
})
export class ConnexionComponent {
  @ViewChild('modal', { static: true })
  modal!: ElementRef;

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate(['home/login']);
    console.log('navigate ouuuuu');
    
    const classes = this.modal.nativeElement.classList;
    
    if (classes.contains('hidden')) {
      classes.remove('hidden');
    }
  }

  close() {
    const classes = this.modal.nativeElement.classList;

    if (!classes.contains('hidden')) {
      classes.add('hidden');
    }
  }
}