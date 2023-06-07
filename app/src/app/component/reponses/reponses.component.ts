import { Component, OnInit } from '@angular/core';
import { ReplyService } from '../../reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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


  ngOnInit() {
    
    this.replyService.getResponses().subscribe(
      (data) => {
        this.responses = data;
        console.log(this.responses);
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
          if (response.message == 'Downvote enregistré avec succès') {
            console.log(response.responses);
          } else {
            console.log('Le vote a échoué');
          }
        },
        (error) => {
          console.error('Erreur lors de la transmission des informations :', error);
        }
      );
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
            console.log(response.responses);
          } else {
            console.log('Le vote a échoué');
          }
        },
        (error) => {
          console.error('Erreur lors de la transmission des informations :', error);
        }
      );
  }  

  seemore(): void {
    this.sliceIndex += 6;
  }
}
