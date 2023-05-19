import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
  
export class InputComponent {
  isClicked: any;
  replyContent: string = '';
  isReplyClicked: boolean = false;

  constructor(private replyService: ReplyService) {
    console.log(this.replyService.isReplyClicked$)
  }

  ngOnInit(): void {

  }

  onClick() {
    this.replyService.setReply(this.replyContent);
    this.replyContent = '';

    const nouvelleValeur = true;
    this.replyService.updateMaVariable(nouvelleValeur);
  }
}
