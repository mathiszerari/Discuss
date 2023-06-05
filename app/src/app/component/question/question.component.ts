import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styles: []
})
export class QuestionComponent implements OnInit {
  question: string = 'Why is Messi better than Ronaldo ?';

  ngOnInit() {
    localStorage.setItem('question', this.question);
  }
}
