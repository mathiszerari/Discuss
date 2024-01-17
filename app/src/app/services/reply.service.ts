import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  username: string;
  profile_photo_id: string;
}

interface ProfilePhoto {
  url: string;
}

@Injectable({
  providedIn: 'root'
})

export class ReplyService {
  private apiUrl: string = 'http://192.168.64.4:24/api/';
  private replySubject = new BehaviorSubject<string>('');
  responses: any[] = [];
  userProfile: UserProfile | null = null;
  profilePhoto: ProfilePhoto | null = null;
  username: string | null = null;
  newimg: any | undefined;

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
