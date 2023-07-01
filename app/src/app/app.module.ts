import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './component/home/question/question.component';
import { ConceptComponent } from './component/concept/concept/concept.component';
import { ReponsesComponent } from './component/home/reponses/reponses.component';
import { InputComponent } from './component/home/input/input.component';
import { TitleComponent } from './component/common/title/title.component';
import { FooterComponent } from './component/concept/footer/footer.component';
import { HomeComponent } from './component/home/home/home.component';
import { FooterRedirectHomeComponent } from './component/concept/footer-redirect-home/footer-redirect-home.component';
import { ConceptTextComponent } from './component/concept/concept-text/concept-text.component';
import { ReplyService } from './services/reply.service';
import { ConnexionComponent } from './component/home/connexion/connexion.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarStreakComponent } from './component/profile/calendar-streak/calendar-streak.component';
import { ProfileComponent } from './component/profile/profile/profile.component';
import { InfosComponent } from './component/profile/infos/infos.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    ConceptComponent,
    ReponsesComponent,
    InputComponent,
    TitleComponent,
    FooterComponent,
    HomeComponent,
    FooterRedirectHomeComponent,
    ConceptTextComponent,
    ConnexionComponent,
    CalendarStreakComponent,
    ProfileComponent,
    InfosComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    ReponsesComponent,
    ReplyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
