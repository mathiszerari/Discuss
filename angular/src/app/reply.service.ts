import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReplyService {
  private replySubject = new BehaviorSubject<string>('');

  reply$ = this.replySubject.asObservable();
  isReplyClicked$: boolean = false;

  setReply(reply: string) {
    this.replySubject.next(reply);
  }

  private isClicked = new Subject<any>();
  clicked$ = this.isClicked.asObservable();

  updateMaVariable(nouvelleValeur: any) {
    this.isClicked.next(nouvelleValeur);
  }
}
