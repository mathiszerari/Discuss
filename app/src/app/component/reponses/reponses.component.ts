import { Component, OnInit } from '@angular/core';
import { ReplyService } from '../../reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})
  
export class ReponsesComponent implements OnInit {
  responses: any[] = [];
  url: string = 'http://127.0.0.1:5000/';

  clicked: any;
  reply: string | undefined;
  username: string | undefined;
  upvote: number | undefined;
  downvote: number | undefined;
  clickedUser: string | undefined;
  clickedReply: string | undefined;
  sliceIndex: number = 6;
  upvoteimg: string = 'assets/arrow.up@2x.png';
  downvoteimg: string = 'assets/arrow.down@2x.png';
  heure: any


  ngOnInit() {
    this.replyService.getResponses().subscribe(
      (data) => {
        this.responses = data;
        console.log(this.responses);
  
        this.responses.forEach((response) => {
          response.upvoteimg = 'assets/arrow.up@2x.png';
          response.downvoteimg = 'assets/arrow.down@2x.png';
        });
      },
      (error) => {
        console.log('Une erreur est survenue lors de la récupération des réponses.');
      }
    );
  
    this.replyService.clicked$.subscribe(nouvelleValeur => {
      this.clicked = nouvelleValeur;
    });
  
    console.log('connected : ' + localStorage['userAuthenticated']);
    this.username = localStorage['username'];
  }
  

  constructor(private replyService: ReplyService,
              private http: HttpClient) {
    this.replyService.reply$.subscribe(reply => {
      this.reply = reply;
    });
  }  

  downvotefn(response: any) {
    this.replyService.onClick(response);
    console.log('downvote');
    this.clickedUser = response.username;
    this.clickedReply = response.reply;
    console.log(this.clickedUser);
    console.log(this.clickedReply);
    
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
    if (response.upvote == 'assets/arrow.up.red@2x.png') {
      response.upvote = 'assets/arrow.up@2x.png'
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
    
    // Envoie les données vers Flask
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
  
    // Incrémente le compteur d'upvote
    response.upvote += 1;
    response.upvoteimg = 'assets/arrow.up.blue@2x.png';
  
    // Vérifie si le downvote est activé, puis annule le downvote
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
    this.responses.push(response);
  }
  
}
