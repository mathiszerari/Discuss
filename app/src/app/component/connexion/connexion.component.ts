import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
  url: string = 'http://127.0.0.1:5000/api/';
  inSession: boolean = false;
  emailOrUsername: string = '';
  sessionName: string = '';
  iDconnexion: string = '';
  infoOpen: boolean | undefined;
  isLoading: boolean | undefined;
  profilePhoto: File | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.inSession = localStorage.getItem('connected') === 'true';
    console.log(localStorage);
    if (localStorage.getItem('connected') === 'true') {
      console.log('name : ' + localStorage['username']);
    }
    
    if (localStorage['username']) {
      this.iDconnexion = localStorage['username']
    }
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
    this.isLoading = true;
    this.authService.login(this.emailOrUsername, this.password) // Passer emailOrUsername au lieu de email et laisser une chaîne vide pour username
    console.log(this.emailOrUsername, this.password);
    this.http.post<any>(this.url + 'login', { emailOrUsername: this.emailOrUsername, password: this.password }) // Utiliser emailOrUsername dans la requête HTTP
      .pipe(
        catchError(error => {
          return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
        })
      )
      .subscribe(
        (response: any) => { // Définir le type de 'response' comme 'any'
          if (response && response.message == 'Authentification réussie') {
            this.isLoading = false;
            this.success = response.message
            localStorage.setItem('connected', 'true');
            this.inSession = localStorage.getItem('connected') === 'true';

            localStorage.setItem('username', this.emailOrUsername);
            console.log(localStorage['username']);
            
            
            localStorage.setItem('username', this.emailOrUsername) // Utiliser emailOrUsername comme nom d'utilisateur
            this.iDconnexion = localStorage['username']
            this.router.navigate(['home']);
          } else {
            this.message = 'Utilisateur introuvable';
            this.isLoading = false;
            console.log('auth ratée');
            console.log(response);
            console.log(response.message);
            this.router.navigate(['home/login']);
          }
          
          setTimeout(() => {
            if (this.success === 'Authentification réussie') {
              this.close();
            }
          }, 5000);
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
    );
  }

  signup() {
    const emailValue = this.email;
    const usernameValue = this.username;
    const passwordValue = this.password;
    this.isLoading = true;
  
    // Récupérer le fichier sélectionné
    const profilePhotoFile: File | undefined = this.profilePhoto;
    
    // Créer un objet FormData pour envoyer les données et le fichier
    if (profilePhotoFile) {
      // Un fichier a été sélectionné, inclure le fichier dans la requête
      const formData = new FormData();
      formData.append('email', emailValue);
      formData.append('username', usernameValue);
      formData.append('password', passwordValue);
      formData.append('profilePhoto', profilePhotoFile, profilePhotoFile.name);
  
      // Envoyer les données et le fichier à la base de données
      this.http.post<any>(this.url + 'users', formData)
        .pipe(
          catchError(error => {
            return throwError(error);
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse
            // ...
          },
          (error) => {
            console.error('Error submitting form:', error);
          }
        );
    } else {
      const formData = new FormData();
      formData.append('email', emailValue);
      formData.append('username', usernameValue);
      formData.append('password', passwordValue);
    
      // Envoie les données vers Flask
      this.http.post<any>(this.url + 'users', formData)
        .pipe(
          catchError(error => {
            return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse si nécessaire
            if (response.message == 'Utilisateur créé avec succès') {
              this.isLoading = false;
              localStorage.setItem('connected', 'true');
              this.inSession = localStorage.getItem('connected') === 'true';
              console.log(this.inSession);
              this.success = response.message;
              this.erreur = '';
    
              console.log(usernameValue);
              
              localStorage.setItem('username', usernameValue) ;
              this.iDconnexion = localStorage['username'];
            } else {
              this.isLoading = false;
              this.erreur = response.message;
              this.success = '';
            }
          },
          (error) => {
            console.error('Error submitting form:', error);
          }
        );
    }
  
    // Réinitialise les valeurs des inputs après l'envoi du formulaire
    this.email = '';
    this.username = '';
    this.password = '';
        
    setTimeout(() => {
      if (this.success == 'Utilisateur créé avec succès') {
        this.close();
      }
    }, 5000);
  }  

  onFileSelected(event: any) {
    this.profilePhoto = event.target.files && event.target.files.length > 0 ? event.target.files[0] : undefined;
  }  

  logout() {
    console.log(this.inSession);
    this.message = 'Vous avez été déconnecté';
    localStorage.setItem('connected', 'false');
    this.inSession = localStorage.getItem('connected') === 'true';
    console.log(this.inSession);


    localStorage.setItem('username', '');
    this.iDconnexion = ''
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

  openmini() {
    this.infoOpen = true
  }

  backmini() {
    this.infoOpen = false
  }
}
