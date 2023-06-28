import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  username: string;
  profile_photo_id: string;
}

interface ProfilePhoto {
  url: string;
}

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styles: []
})
export class TitleComponent implements OnInit {
  url: string = 'http://127.0.0.1:5000/api/';
  userProfile: UserProfile | null = null;
  profilePhoto: ProfilePhoto | null = null;
  username: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Récupérer le username du local storage
    this.username = localStorage.getItem('username');
    console.log(this.username);

    if (this.username) {
      // Appeler l'API pour récupérer les informations du profil de l'utilisateur
      this.http.get<UserProfile>(this.url + `getuser/${this.username}`).subscribe(
        data => {
          this.userProfile = data;
          this.loadProfilePhoto();
          console.log(this.userProfile);
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération du profil de l\'utilisateur :', error);
        }
      );
    }
  }

  loadProfilePhoto() {
    if (this.userProfile) {
      // Appeler l'API pour récupérer l'utilisateur
      this.http.get<any>(this.url + `getuser/${this.username}`).subscribe(
        userData => {
          // Vérifier si l'utilisateur a une photo de profil
          if (userData.profile_photo) {
            // La photo de profil est déjà incluse dans les données de l'utilisateur
            this.profilePhoto = userData.profile_photo;
            console.log(this.profilePhoto);
            
          }
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération de l\'utilisateur :', error);
        }
      );
    }
  }
  
}
