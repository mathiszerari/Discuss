import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReplyService {
  private apiUrl: string = 'https://mathiszer.pythonanywhere.com/api/';
  private replySubject = new BehaviorSubject<string>('');
  responses: any[] = [];

  constructor(private http: HttpClient) {}

  reply$ = this.replySubject.asObservable();
  isReplyClicked$: boolean = false;

  setReply(reply: string) {
    this.replySubject.next(reply);
  }

  updateMaVariable(nouvelleValeur: any) {
    this.isClicked.next(nouvelleValeur);
  }

  private isClicked = new BehaviorSubject<any>(null);
  clicked$ = this.isClicked.asObservable();

  onClick(reply: any) {
    this.isClicked.next(reply);
  }

  getResponses(algorithm: string) {
    const url = `${this.apiUrl}getresponses?algorithm=${algorithm}`;
    return this.http.get<any[]>(url);
  }
}
