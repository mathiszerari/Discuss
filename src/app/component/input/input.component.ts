import { Component } from '@angular/core';
import { ReponsesComponent } from '../reponses/reponses.component';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
  
export class InputComponent {
  constructor(private ReponsesComponent: ReponsesComponent) { }
  
  replyContent: string = '';

  ngOnInit() {
    // this.ReponsesComponent.reply = this.replyContent;
  }

  onClick() {
    console.log('reply added');
    
    this.ReponsesComponent.reply = this.replyContent;
    console.log(this.ReponsesComponent.reply);
  }
}
