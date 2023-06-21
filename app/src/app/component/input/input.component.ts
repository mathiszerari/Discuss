import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ReplyService } from '../../reply.service';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  url: string = 'http://127.0.0.1:5000/api/';
  upvoteimg: string = 'assets/arrow.up@2x.png';
  downvoteimg: string = 'assets/arrow.down@2x.png';
  newresponse: string = '';
  upvote: number = 0;
  downvote: number = 0;
  index: number = 0;
  connected: string = localStorage['connected'];
  score: number = 0;
  shakeshake: boolean = true;

  constructor(
    private replyService: ReplyService,
    private renderer: Renderer2,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.connected)
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

  response() {
    
    if (this.replyContent.length === 0 && this.shakeshake) {
      this.shakeit();
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

    if (this.replyContent.length < 2 && this.shakeshake) { 
      alert('Votre réponse est trop courte pour apporter au débat')
    }
  
    // Envoie les données vers Flask
    if (this.replyContent.length > 2) {
      const table = {
        index: index,
        username: usernameValue,
        question: question,
        reply: replyValue,
        upvote: upvote,
        downvote: downvote,
        score: score
      }
      console.log(this.replyService.responses);
      this.replyService.responses.unshift(table);
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
              console.log(response.responses);
              console.log(replyValue);
              console.log('1');
              
    
              // Stocker l'ID utilisateur dans le localStorage
              const userId = response.user_id;
              localStorage.setItem('user_id', userId);
            } else {
              console.log('Réponse non enregistrée');
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

    setTimeout(() => {
      window.location.reload();
    }, 10000000000)
  }
}
