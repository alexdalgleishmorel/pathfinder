import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ColorThemeService {
  private colorTheme: any;

  constructor() {
    this.colorTheme = new BehaviorSubject<any>('dark');
  }

  getColorThemeValue(): Observable<any> {
    return this.colorTheme;
  }

  setColorThemeValue(newValue: any): void {
    this.colorTheme.next(newValue);
  }
}
