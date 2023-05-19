import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})
  
export class ReponsesComponent {
  clicked: any;
  reply: string | undefined;

  ngOnInit() {
    this.replyService.clicked$.subscribe(nouvelleValeur => {
      this.clicked = nouvelleValeur;
    });
  }

  constructor(private replyService: ReplyService) {
    this.replyService.reply$.subscribe(reply => {
      this.reply = reply;
    });
  }  

  
}
