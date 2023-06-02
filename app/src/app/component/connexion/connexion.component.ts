import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  erreur: string = '';
  success: string = '';
  creatingAccount: boolean = false;
  url: string = 'http://127.0.0.1:5000/';
  inSession: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.inSession = localStorage.getItem('userAuthenticated') === 'true';
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

  // setMessage() {
  //   if (this.authService.isLogged) {
  //     this.message = '(pastille & msg vert) Vous êtes connecté';
  //   } else {
  //     this.message = '(pastille & msg rouge) Réessayez le mot de passe ou le nom d\'utilisateur incorrect';
  //   }
  // }

  login() {
    this.message = 'Connexion en cours';
    this.authService.login(this.username, this.password)
    console.log(this.username, this.password);
    this.http.post<any>(this.url + 'login', { email: this.email, username: this.username, password: this.password })
      .pipe(
        catchError(error => {
          return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
        })
      )
      .subscribe(
        (response: any) => { // Définir le type de 'response' comme 'any'
          if (response && response.message == 'Authentification réussie') {
            console.log('auth reussie');
            localStorage.setItem('userAuthenticated', 'true');
            this.router.navigate(['home']);
          } else {
            console.log('auth ratée');
            console.log(response);
            console.log(response.message);
            
            this.password = '';
            this.router.navigate(['home/login']);
          }
          
          // setTimeout(() => {
          //   this.close();
          // }, 1500);
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
    );
    
  }
  

  logout() {
    this.authService.logout();
    this.message = 'Vous avez été déconnecté';
    this.inSession = localStorage.getItem('userAuthenticated') === 'false';
  }

  signup() {
    const emailValue = this.email;
    const usernameValue = this.username;
    const passwordValue = this.password;
  
    // Envoie les données vers Flask
    this.http.post<any>(this.url + 'users', { email: emailValue, username: usernameValue, password: passwordValue })
      .pipe(
        catchError(error => {
          return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
        })
      )
      .subscribe(
        (response) => {
          // Traitement de la réponse si nécessaire
          if (response.message == 'Utilisateur créé avec succès') {
            this.success = response.message
            this.erreur = ''
          } else {
            this.erreur = response.message
            this.success = ''
          }
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
  
    // Réinitialise les valeurs des inputs après l'envoi du formulaire
    this.email = '';
    this.username = '';
    this.password = '';
        
    setTimeout(() => {
      this.close();
    }, 5000);
    
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
