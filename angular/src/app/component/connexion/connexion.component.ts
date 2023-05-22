import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HttpClient } from '@angular/common/http';

interface User {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styles: []
})
export class ConnexionComponent {
  users: User[];

  @ViewChild('modal', { static: true })
  modal!: ElementRef;
  message: string;
  email: string;
  username: string;
  password: string;
  createAccount: string;
  auth: AuthService;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.message = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.createAccount = '';
    this.auth = authService;
    this.users = [];
  }

  ngOnInit() {
    this.auth = this.authService;
    this.getUsers();
  }

  getUsers() {
    this.http.get<User[]>('/users').subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error retrieving users:', error);
      }
    );
  }

  setMessage() {
    if (this.auth.isLogged) {
      this.message = '(pastille & msg vert) Vous êtes connecté';
    } else {
      this.message = '(pastille & msg rouge) Réessayez le mot de passe ou le nom d\'utilisateur incorrect';
    }
  }

  login() {
    this.message = 'Connexion en cours';
    this.auth.login(this.username, this.password).subscribe((isLogged: boolean) => {
      this.setMessage();
      if (isLogged) {
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
    this.auth.logout();
    this.message = 'Vous avez été déconnecté';
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
