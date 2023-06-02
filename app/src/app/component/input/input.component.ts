import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { ReplyService } from '../../reply.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements AfterViewInit {
  @ViewChild('input', { static: false })
  input!: ElementRef;
  isClicked: any;
  replyContent: string = '';
  isReplyClicked: boolean = false;
  isShaking: boolean = false;

  constructor(private replyService: ReplyService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
  }

  shakeit() {
    if (!this.isShaking) {
      this.isShaking = true;
      this.renderer.addClass(this.input.nativeElement, 'shakeit');
      
      setTimeout(() => {
        this.renderer.removeClass(this.input.nativeElement, 'shakeit');
        this.isShaking = false;
      }, 1000);
    }
  }
  
  reply() {
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
}
