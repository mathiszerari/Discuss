import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ReplyService } from '../../../services/reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface UserProfile {
  username: string;
  profile_photo_id: string;
}

interface ProfilePhoto {
  url: string;
}

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements AfterViewInit {
  @ViewChild('input', { static: false })
  commentInput!: ElementRef;

  @ViewChild('textera', { static: false })
  textera!: ElementRef;

  isClicked: any;
  replyContent: string = '';
  isReplyClicked: boolean = false;
  isShaking: boolean = false;
  url: string = 'http://10.57.33.33:5000/api/';
  upvoteimg: string = 'assets/arrow.up@2x.png';
  downvoteimg: string = 'assets/arrow.down@2x.png';
  newresponse: string = '';
  upvote: number = 0;
  downvote: number = 0;
  index: number = 0;
  connected: string = localStorage['connected'];
  score: number = 0;
  shakeshake: boolean = true;
  messageSend: boolean | undefined;
  warningValue: string | undefined;
  userProfile: UserProfile | null = null;
  profilePhoto: ProfilePhoto | null = null;
  newimg: any;
  username: any = localStorage['username'];

  constructor(
    private replyService: ReplyService,
    private renderer: Renderer2,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Récupérer le username du local storage
    this.username = localStorage.getItem('username');
    console.log('mdr');
    
    if (this.username) {
      console.log('lol');
      // Appeler l'API pour récupérer les informations du profil de l'utilisateur
      this.http.get<UserProfile>(this.url + `getuser/${this.username}`).subscribe(
        data => {
          this.userProfile = data;
          console.log(this.newimg);
          
          this.loadProfilePhoto();
          
          console.log('bbbbbbbbbbbbbbbbbbbbbbb ' + this.newimg);
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération du profil de l\'utilisateur :', error);
        }
        );
      }
    }
    
    response() {
      if (this.replyContent.length === 0 && this.shakeshake) {
        this.shakeit();
        this.warningValue = "Your message is too short"
        this.messageSend = false
        setTimeout(() => {
          this.messageSend = undefined;
        }, 4000);
        return;
      }
  
      const usernameValue = localStorage['username'];
      const replyValue = this.replyContent;
      let upvote = this.upvote;
      let downvote = this.downvote;
      let question = localStorage.getItem('question')
      let index = this.index;
      let score = this.score;
      index++

      let pp = this.newimg
    
      // Envoie les données vers Flask
      if (this.replyContent.length > 1) {
        const table = {
          index: index,
          username: usernameValue,
          question: question,
          reply: replyValue,
          upvote: upvote,
          downvote: downvote,
          score: score,
          pp: pp
        }
        console.log('aaaaaaaaaaaaa ' + pp);
        
        console.log('---------------------------------------' + this.newimg);
        console.log(this.replyService.responses);
        console.log(this.replyService.responses);
        
        this.http.post<any>(this.url + 'response', table)
          .pipe(
            catchError(error => {
              return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
            })
          )
          .subscribe(
            (response) => {
              // Traitement de la réponse si nécessaire
              if (response.message == 'Réponse enregistrée avec succès') {
                console.log(response.message + ' ' + response.responses);
                console.log(replyValue);
  
                this.messageSend = true
                this.replyService.responses.unshift(table);
                setTimeout(() => {
                  this.messageSend = undefined;
                }, 4000);
                // Stocker l'ID utilisateur dans le localStorage
                const userId = response.user_id;
                localStorage.setItem('user_id', userId);
              } else {
                console.log('Réponse non enregistrée');
                this.messageSend = false
                setTimeout(() => {
                  this.messageSend = undefined;
                }, 4000);
  
                if (!this.connected == false) {
                  this.warningValue = "Connect you to reply"
                }
              }
            },
            (error) => {
              console.error('Erreur lors de l\'envoi du formulaire :', error);
            }
        );
      }
  
      this.replyService.setReply(this.replyContent);
      console.log(this.replyContent);
      const nouvelleValeur = true;
      this.replyService.updateMaVariable(nouvelleValeur);
      this.isReplyClicked = true;
      this.replyContent = '';
  
      this.shakeshake = false;
      console.log('2');
    }
  
  ngAfterViewInit(): void {
    if (this.connected === 'false') {
      this.renderer.listen(this.textera.nativeElement, 'focus', () => {
        console.log('modal ouverture');
      });
    }
  }

  shakeit() {
    if (!this.isShaking) {
      this.isShaking = true;
      this.renderer.addClass(this.commentInput.nativeElement, 'shakeit');
      
      setTimeout(() => {
        this.renderer.removeClass(this.commentInput.nativeElement, 'shakeit');
        this.isShaking = false;
      }, 1000);
    }
  }

  old() {
    if (this.replyContent.length > 0) {
      this.replyService.setReply(this.replyContent);
      console.log(this.replyContent);
      this.replyContent = '';
      const nouvelleValeur = true;
      this.replyService.updateMaVariable(nouvelleValeur);
      this.isReplyClicked = true;
    } else {
      this.shakeit();
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

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!(blob instanceof Blob)) {
        reject(new Error('Parameter is not a Blob.'));
      }
  
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  convertUrlToBlob(url: string): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error('Error loading image URL.'));
        }
      };
  
      xhr.onerror = () => {
        reject(new Error('Error loading image URL.'));
      };
  
      xhr.send();
    });
  }
  
  
}