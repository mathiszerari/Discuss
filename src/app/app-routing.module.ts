import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { ConceptComponent } from './concept/concept.component';
import { InputComponent } from './input/input.component';

const routes: Routes = [
  {
    path: 'home',
    component: QuestionComponent,
  },
  {
    path: 'home',
    component: InputComponent,
  },
  {
    path: 'concept',
    component: ConceptComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
