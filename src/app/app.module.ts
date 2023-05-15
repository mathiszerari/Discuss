import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { ConceptComponent } from './concept/concept.component';
import { ReponsesComponent } from './reponses/reponses.component';
import { InputComponent } from './input/input.component';
import { TitleComponent } from './title/title.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { FooterRedirectHomeComponent } from './footer-redirect-home/footer-redirect-home.component';

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
    FooterRedirectHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
