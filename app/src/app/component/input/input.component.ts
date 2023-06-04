import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { ReplyService } from '../../reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements AfterViewInit {
  @ViewChild('commentInput', { static: false })
  commentInput!: ElementRef;
  isClicked: any;
  replyContent: string = '';
  isReplyClicked: boolean = false;
  isShaking: boolean = false;
  url: string = 'http://127.0.0.1:5000/';

  constructor(
    private replyService: ReplyService,
    private renderer: Renderer2,
    private http: HttpClient
  ) { }

  ngAfterViewInit(): void {
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

  response() {
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

    const usernameValue = localStorage['username'];
    const replyValue = this.replyContent;
  
    // Envoie les données vers Flask
    this.http.post<any>(this.url + 'response', { username: usernameValue, reply: replyValue })
      .pipe(
        catchError(error => {
          return throwError(error); // Renvoyer l'erreur pour le traitement ultérieur
        })
      )
      .subscribe(
        (response) => {
          // Traitement de la réponse si nécessaire
          if (response.message == 'Réponse enregistrée avec succès') {
            console.log(response.answer);
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
