import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styles: []
})
export class ConnexionComponent {
  @ViewChild('modal', { static: true })
  modal!: ElementRef;
  message: string;
  email: string;
  username: string;
  password: string;
  createAccount: string;
  auth: AuthService;

  constructor(private router: Router, private authService: AuthService) {
    this.message = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.createAccount = '';
    this.auth = authService;
  }

  ngOnInit() {
    this.auth = this.authService;
  }

  setMessage() {
    if (this.auth.isLogged) {
      this.message = '(pastille & msg vert) Vous etes connecté'
    } else {
      this.message = '(pastille & msg rouge) Reessayez mdp ou username incorrect'
    }
  }

  login() {
    this.message = 'Connexion en cours';
    this.auth.login(this.username, this.password)
      .subscribe((islogged: boolean) => {
        this.setMessage();
        if (islogged) {
          this.router.navigate(['home']);
        } else {
          this.password = '';
          this.router.navigate(['home/login']);
        }
        console.log(this.username, this.password);
        setTimeout(() => {
          this.close(); 
        }, 2000);
      });
  }

  logout() {
    this.auth.logout()
    this.message = 'Vous avez été déconnecté'
  }

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