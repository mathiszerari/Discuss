import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './component/question/question.component';
import { ConceptComponent } from './component/concept/concept.component';
import { ReponsesComponent } from './component/reponses/reponses.component';
import { InputComponent } from './component/input/input.component';
import { TitleComponent } from './component/title/title.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { FooterRedirectHomeComponent } from './component/footer-redirect-home/footer-redirect-home.component';
import { ConceptTextComponent } from './component/concept-text/concept-text.component';
import { ReplyService } from './reply.service';
import { ConnexionComponent } from './component/connexion/connexion.component';

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
    ConnexionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    ReponsesComponent,
    ReplyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
