import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptComponent } from './component/concept/concept/concept.component';
import { HomeComponent } from './component/home/home/home.component';
import { AuthGuard } from './auth.guard';
import { InputComponent } from './component/home/input/input.component';
import { ConnexionComponent } from './component/home/connexion/connexion.component';
import { CalendarStreakComponent } from './component/profile/calendar-streak/calendar-streak.component';
import { ProfileComponent } from './component/profile/profile/profile.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'reply', component: InputComponent, canActivate:[AuthGuard] },
      { path: 'login', component: ConnexionComponent },
      { path: 'calendar', component: CalendarStreakComponent },
      // Ajoutez d'autres routes pour les composants de la page
    ]
  },
  {
    path: 'concept',
    component: ConceptComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
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
