import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})
  
export class ReponsesComponent {
  clicked: any;
  reply: string | undefined;
  username: string | undefined;

  ngOnInit() {
    this.replyService.clicked$.subscribe(nouvelleValeur => {
      this.clicked = nouvelleValeur;
    });

    console.log('connected : ' + localStorage['userAuthenticated']);
    this.username = localStorage['username'];
  }

  constructor(private replyService: ReplyService) {
    this.replyService.reply$.subscribe(reply => {
      this.reply = reply;
    });
  }  
}
