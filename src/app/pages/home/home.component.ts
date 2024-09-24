import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import * as KosherZmanim from 'kosher-zmanim';
import { LocationService } from '../../lib/location.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatGridListModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  latitude: number = 0;
  longitude: number = 0;
  elevation: number = 0;
  errorMessage: string | undefined;
  localDate: Date = new Date();
  today: string = '';
  constructor(private locationService: LocationService) {}

  async ngOnInit() {
    try {
      const position = await this.locationService.getUserLocation();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.elevation = position.coords.altitude ?? 0;
    } catch (error: any) {
      this.errorMessage = error.message;
    }

    this.updateDate();
  }

  getHebrewDate(): string {
    const jewishCalendar = new KosherZmanim.JewishCalendar(this.localDate);
    const hebrewDateFormatter = new KosherZmanim.HebrewDateFormatter();
    return hebrewDateFormatter.format(jewishCalendar);
  }

  updateDate() {
    this.today = `${this.formatDate(this.localDate)} - ${this.getHebrewDate()}`;
  }

  formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const locale = navigator.language;
    const formattedDate = date.toLocaleDateString(locale, options);

    return formattedDate;
  };

  increaseDate() {
    this.localDate.setDate(this.localDate.getDate() + 1);
    this.updateDate();
  }

  decreaseDate() {
    this.localDate.setDate(this.localDate.getDate() - 1);
    this.updateDate();
  }
}
