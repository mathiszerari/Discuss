// reply.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  private replySubject = new BehaviorSubject<string>('');

  reply$ = this.replySubject.asObservable();
  isReplyClicked$: any;

  setReply(reply: string) {
    this.replySubject.next(reply);
  }
}
