import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptComponent } from './component/concept/concept.component';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'concept',
    component: ConceptComponent,
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
