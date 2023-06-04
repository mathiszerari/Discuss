import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})
  
export class ReponsesComponent {
  clicked: any;
  reply: string | undefined;
  username: string | undefined;
  url: string = 'http://127.0.0.1:5000/';

  ngOnInit() {
    this.replyService.clicked$.subscribe(nouvelleValeur => {
      this.clicked = nouvelleValeur;
    });

    console.log('connected : ' + localStorage['userAuthenticated']);
    this.username = localStorage['username'];
  }

  constructor(
    private replyService: ReplyService, 
    private http: HttpClient
  ) {
    this.replyService.reply$.subscribe(reply => {
      this.reply = reply;
    });
  }  

  response() {
    const replyValue = this.reply;
    const usernameValue = localStorage['username'];
  
    // Envoie les données vers Flask
    this.http.put<any>(this.url + 'response', { reply: replyValue, username: usernameValue })
      .pipe(
        catchError(error => {
          return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
        })
      )
      .subscribe(
        (response) => {
          // Traitement de la réponse si nécessaire
          if (response.message == 'Réponse inscrite avec succès') {
            console.log(replyValue);
          } else {
            console.log('réponse non enregistrée');
            
          }
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
  }
}
