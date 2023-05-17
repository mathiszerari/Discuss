import { Component } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
  
export class InputComponent {
  
  replyContent: string = '';
  isReplyClicked: boolean | undefined;

  constructor(private replyService: ReplyService) { }

  onClick() {
    this.replyService.setReply(this.replyContent);
    this.replyContent = ''; // Réinitialise le contenu de la réponse après l'avoir envoyé
    this.isReplyClicked = true;
  }
}
