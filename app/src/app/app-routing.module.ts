import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptComponent } from './component/concept/concept.component';
import { HomeComponent } from './component/home/home.component';
import { AuthGuard } from './auth.guard';
import { InputComponent } from './component/input/input.component';
import { ConnexionComponent } from './component/connexion/connexion.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'reply', component: InputComponent, canActivate:[AuthGuard] },
      { path: 'login', component: ConnexionComponent },
      // Ajoutez d'autres routes pour les composants de la page
    ]
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
