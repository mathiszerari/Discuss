import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar-streak',
  templateUrl: './calendar-streak.component.html',
  styles: [
  ]
})
export class CalendarStreakComponent {
  currentMonth: string | undefined;
  currentYear: number | undefined;
  days: number[] | undefined;
  calendarWeeks: number[][] = [];
  date: any
  
  constructor() {
    this.generateCalendarWeeks();
  }
  
  ngOnInit() {
    // Récupérer la date actuelle
    const currentDate = new Date();
  
    // Obtenir le mois et l'année actuels
    this.currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = currentDate.getFullYear();
  
    // Obtenir le nombre de jours dans le mois actuel
    const lastDay = new Date(this.currentYear, currentDate.getMonth() + 1, 0).getDate();
  
    // Générer un tableau avec les jours du mois
    this.days = Array(lastDay)
      .fill(0)
      .map((_, index) => index + 1);
  }  

  generateCalendarWeeks() {
    const currentDate = new Date(); // Date actuelle
    const currentYear = currentDate.getFullYear(); // Année actuelle
    const currentMonth = currentDate.getMonth(); // Mois actuel (0-11)
    this.date = currentDate.getDate(); // Jour actuel
  
    // Obtenez le premier jour du mois en cours
    const firstDayOfMonth = new Date(currentYear, currentMonth, 0);
    let startingDay = firstDayOfMonth.getDay(); // Jour de la semaine du premier jour du mois (0-6, 0 = dimanche)
  
    // Obtenez le nombre de jours dans le mois en cours
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const numDays = lastDayOfMonth.getDate();
  
    let dayCounter = 1; // Compteur pour les jours du mois
    let week: any[] = []; // Tableau pour stocker les jours de chaque semaine
    this.calendarWeeks = []; // Réinitialiser le tableau des semaines du calendrier
  
    // Remplir le tableau des semaines du calendrier avec les jours du mois
    for (let i = 0; i < 6; i++) { // Maximum de 6 semaines
      week = []; // Réinitialiser le tableau pour chaque nouvelle semaine
  
      // Remplir les jours vides avant le premier jour du mois
      if (i === 0) {
        for (let j = 0; j < startingDay; j++) {
          week.push(''); // Utilisez une valeur de 0 pour les jours vides
        }
      }
  
      // Remplir les jours du mois
      for (let j = startingDay; j < 7; j++) {
        if (dayCounter > numDays) {
          break; // Tous les jours du mois ont été ajoutés, sortir de la boucle
        }
        const day = { day: dayCounter, active: false };
        if (i === currentMonth && dayCounter === this.date) {
          day.active = true; // Ajouter la classe "active" au jour actuel
        }
        
        week.push(day.day);
        dayCounter++;
      }
  
      // Ajouter la semaine au tableau des semaines du calendrier
      this.calendarWeeks.push(week);
  
      // Réinitialiser le jour de départ pour les semaines suivantes
      startingDay = 0;
    }
  }  
}
