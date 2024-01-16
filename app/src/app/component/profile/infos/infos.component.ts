import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface UserProfile {
  username: string;
  profile_photo_id: string;
  email: string;
}

interface ProfilePhoto {
  url: string;
}

@Component({
  selector: 'app-infos',
  templateUrl: './infos.component.html',
  styles: []
})
export class InfosComponent implements OnInit {
  userProfile: UserProfile | null = null;
  username: any = localStorage.getItem('username');
  email: any = localStorage.getItem('email');
  url: string = 'http://10.57.33.33:5000/api/';
  profilePhoto: ProfilePhoto | null = null;
  newimg: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Récupérer le username du local storage
    this.username = localStorage.getItem('username');
    if (this.username) {
      // Appeler l'API pour récupérer les informations du profil de l'utilisateur
      this.http.get<UserProfile>(this.url + `getuser/${this.username}`).subscribe(
        data => {
          this.userProfile = data;
          this.loadProfilePhoto();
          this.email = this.userProfile.email;
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération du profil de l\'utilisateur :', error);
        }
      );
    }
  }

  convertBase64ToUrl(base64String: any): string {
    if (base64String) {
      // Supprime la partie "data:image/png;base64," du début de la chaîne base64
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      
      // Crée un tableau de octets à partir de la chaîne base64
      const byteCharacters = atob(base64Data);
      
      // Crée un tableau d'octets avec la longueur correspondante
      const byteArrays = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      
      // Crée un objet Blob à partir du tableau d'octets
      const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });
      
      // Crée un objet URL à partir du Blob
      const fileUrl = URL.createObjectURL(blob);
  
      return fileUrl;
    }
  
    return ''; // Retourne une chaîne vide si base64String est undefined
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
            this.newimg = this.convertBase64ToUrl(this.profilePhoto);
            localStorage.setItem('pp', this.newimg);
            
          } else {
            this.newimg = userData.profile_photo_url;
            
            localStorage.setItem('pp', this.newimg);
          }
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération de l\'utilisateur :', error);
        }
      );
    }
  }  
}
