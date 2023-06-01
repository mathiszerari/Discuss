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
})
export class ConnexionComponent {
  users: User[] = [];

  @ViewChild('modal', { static: true })
  modal!: ElementRef;
  message: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  creatingAccount: boolean = false;
  url: string = 'http://127.0.0.1:5000/users';

  constructor(
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // this.getUsers();
  }

  getUsers() {
    this.http.get<User[]>(this.url).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error retrieving users:', error);
      }
    );
    return this.http.get(this.url);
  }

  setMessage() {
    if (this.authService.isLogged) {
      this.message = '(pastille & msg vert) Vous êtes connecté';
    } else {
      this.message = '(pastille & msg rouge) Réessayez le mot de passe ou le nom d\'utilisateur incorrect';
    }
  }

  login() {
    this.message = 'Connexion en cours';
    this.authService.login(this.username, this.password).subscribe((isLogged: boolean) => {
      this.setMessage();
      if (isLogged) {
        this.router.navigate(['home']);
      } else {
        this.password = '';
        this.router.navigate(['home/login']);
      }
      // console.log(this.username, this.password);
      setTimeout(() => {
        this.close();
      }, 1500);
    });
  }

  logout() {
    this.authService.logout();
    this.message = 'Vous avez été déconnecté';
  }

  signup() {
    const emailValue = this.email;
    const usernameValue = this.username;
    const passwordValue = this.password;
  
    console.log(emailValue, usernameValue, passwordValue);
  
    // Envoie les données vers Flask
    this.http.post<any>(this.url, { email: emailValue, username: usernameValue, password: passwordValue })
      .subscribe(
        (response) => {
          // Traitement de la réponse si nécessaire
          console.log('Response:', response);
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
  
    // Réinitialise les valeurs des inputs après l'envoi du formulaire
    this.email = '';
    this.username = '';
    this.password = '';

    this.close()
  }

  navigate() {
    this.router.navigate(['home/login']);
    this.open()
  }

  close() {
    const classes = this.modal.nativeElement.classList;

    if (!classes.contains('hidden')) {
      classes.add('hidden');
    }
  }

  createAccount() {
    const classes = this.modal.nativeElement.classList;

    this.open()

    this.creatingAccount = true;
  }

  loginAccount() {
    this.router.navigate(['home/login']);

    this.creatingAccount = false;
  }

  open() {
    const classes = this.modal.nativeElement.classList;

    if (classes.contains('hidden')) {
      classes.remove('hidden');
    }
  }
}
