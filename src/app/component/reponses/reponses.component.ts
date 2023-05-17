import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-reponses',
  templateUrl: './reponses.component.html',
})
  
export class ReponsesComponent {
  reply: string | undefined;

  constructor(private replyService: ReplyService) {
    this.replyService.reply$.subscribe(reply => {
      this.reply = reply;
      console.log('reply added:', this.reply);
    });
  }
  
}
