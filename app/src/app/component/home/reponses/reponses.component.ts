import { Component, OnInit } from '@angular/core';
import { ReplyService } from '../../../services/reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})

export class ReponsesComponent implements OnInit {
  url: string = 'http://192.168.64.4:24/api/';

  clicked: any;
  reply: string | undefined;
  username: string | undefined;
  upvote: number = 0;
  downvote: number = 0;
  clickedUser: string | undefined;
  clickedReply: string | undefined;
  sliceIndex: number = 6;
  upvoteimg: string = 'assets/arrow.up@2x.png';
  downvoteimg: string = 'assets/arrow.down@2x.png';
  heure: any
  voteddown: boolean = false
  votedup: boolean = false
  instant: string = 'À l\'instant'
  noresponse: boolean = false
  selectedAlgorithm: string = 'recent';
  message: string | undefined;
  isLoading: boolean = true;
  recupissues: boolean = false
  isDropdownOpen: boolean = false;
  pp : any | undefined

  ngOnInit() {
    this.replyService.getResponses(this.selectedAlgorithm).subscribe(
      (data:any) => {
        this.replyService.responses = data.data;
        const message = data.message;
        console.log(this.replyService.responses);
        this.pp = this.replyService.responses
        if (this.replyService.responses.length == 0) {
          this.noresponse = true
          this.isLoading = false
          console.log("aucune réponse disponible pour le moment");
        }
  
        this.replyService.responses.forEach((response) => {
          response.upvoteimg = 'assets/arrow.up@2x.png';
          response.downvoteimg = 'assets/arrow.down@2x.png';
        });

        this.isLoading = false;
      },
      (error) => {
        console.log('Une erreur est survenue lors de la récupération des réponses.');
        this.recupissues = true
        this.isLoading = false;
      }
    );
  
    this.replyService.clicked$.subscribe(nouvelleValeur => {
      this.clicked = nouvelleValeur;
    });
  
    console.log('connected : ' + localStorage['connected']);
    this.username = localStorage['username'];
  }

  constructor(public replyService: ReplyService,
        private http: HttpClient) {
    this.replyService.reply$.subscribe(reply => {
    this.reply = reply;
    });
  }  

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  changeAlgorithm(algorithm: string) {
    this.selectedAlgorithm = algorithm;
    console.log(this.selectedAlgorithm);
    this.isLoading = true
    this.isDropdownOpen = false;
    
    this.replyService.getResponses(this.selectedAlgorithm).subscribe(
      (data:any) => {
        this.replyService.responses = data.data;
        this.isLoading = false
        console.log(this.replyService.responses);
        if (this.replyService.responses.length == 0) {
          this.noresponse = true
          this.isLoading = false
          console.log("aucune réponse disponible pour le moment");
        }
        this.replyService.responses.forEach((response) => {
          response.upvoteimg = 'assets/arrow.up@2x.png';
          response.downvoteimg = 'assets/arrow.down@2x.png';
        });
      },
      (error) => {
        console.log('Une erreur est survenue lors de la récupération des réponses.');
        this.isLoading = false
      }
    );
  }

  downvotefn(response: any) {
    this.replyService.onClick(response);
    console.log('downvote');
    this.clickedUser = response.username;
    this.clickedReply = response.reply;
    console.log(this.clickedUser);
    console.log(this.clickedReply);

    if (response.downvoteimg == 'assets/arrow.down.red@2x.png' && this.voteddown) {
      response.downvoteimg = 'assets/arrow.down@2x.png'
      response.downvote -= 1;

      this.http.post<any>(this.url + 'canceldownvote', { username: this.clickedUser, reply: this.clickedReply })
        .pipe(
          catchError(error => {
            return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse si nécessaire
            if (response.message === "Downvote annulé avec succès") {
              console.log(response.message);
            } else {
              console.log('Le vote a échoué');
            }
          },
          (error) => {
            console.error('Erreur lors de la transmission des informations :', error);
          }
        );
      setTimeout(() => {
        this.voteddown = false
      }, 500);
    }

    if (this.voteddown == false) {
      // Envoie les données vers Flask
      this.http.post<any>(this.url + 'downvote', { username: this.clickedUser, reply: this.clickedReply })
        .pipe(
          catchError(error => {
            return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse si nécessaire
            if (response.message === "Downvote enregistré avec succès") {
              console.log(response.message);
            } else {
              console.log('Le vote a échoué');
            }
          },
          (error) => {
            console.error('Erreur lors de la transmission des informations :', error);
          }
        );
      response.downvote += 1;
      response.downvoteimg = 'assets/arrow.down.red@2x.png'
      this.voteddown = true
    }
    if (response.upvoteimg == 'assets/arrow.up.blue@2x.png') {
      response.upvoteimg = 'assets/arrow.up@2x.png'
      response.upvote -= 1;
    }
  }  

  upvotefn(response: any) {
    this.replyService.onClick(response);
    console.log('upvote');
    this.clickedUser = response.username;
    this.clickedReply = response.reply;
    console.log(this.clickedUser);
    console.log(this.clickedReply);

    if (response.upvoteimg == 'assets/arrow.up.blue@2x.png' && this.votedup) {
      response.upvoteimg = 'assets/arrow.up@2x.png'
      response.upvote -= 1;

      this.http.post<any>(this.url + 'cancelupvote', { username: this.clickedUser, reply: this.clickedReply })
        .pipe(
          catchError(error => {
            return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse si nécessaire
            if (response.message == 'Upvote annulé avec succès') {
              console.log(response.message);
            } else {
              console.log('Le vote a échoué');
            }
          },
          (error) => {
            console.error('Erreur lors de la transmission des informations :', error);
          }
      );
      setTimeout(() => {
        this.votedup = false
      }, 500);
    }

    if (!this.votedup) {
      this.http.post<any>(this.url + 'upvote', { username: this.clickedUser, reply: this.clickedReply })
        .pipe(
          catchError(error => {
            return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
          })
        )
        .subscribe(
          (response) => {
            // Traitement de la réponse si nécessaire
            if (response.message == 'Upvote enregistré avec succès') {
              console.log(response.message);
            } else {
              console.log('Le vote a échoué');
            }
          },
          (error) => {
            console.error('Erreur lors de la transmission des informations :', error);
          }
      );
      console.log(this.votedup);
          
      // Incrémente le compteur d'upvote
      response.upvote += 1;
      response.upvoteimg = 'assets/arrow.up.blue@2x.png';
      this.votedup = true
      console.log(this.votedup);
      console.log(this.upvoteimg);
    }
    
    if (response.downvoteimg === 'assets/arrow.down.red@2x.png') {
      response.downvoteimg = 'assets/arrow.down@2x.png';
      response.downvote -= 1;
    }
  }
  
  getElapsedTime(date: string): string {
    const responseDate = moment(date, 'ddd, DD MMM YYYY HH:mm:ss [GMT]');
    const now = moment();
    const duration = moment.duration(now.diff(responseDate));
  
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;
  
    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return 'À l\'instant';
    }
  }
  

  seemore(): void {
    this.sliceIndex += 6;
  }
  
  addCard(response: any) {
    this.replyService.responses.push(response);
  }
  
}
