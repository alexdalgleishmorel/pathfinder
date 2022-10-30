import { Component, OnInit } from '@angular/core';
import { ColorThemeService } from '../services/colorThemeService/color-theme.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  public light: boolean = false;
  public dark: boolean = true;

  constructor(
    private colorThemeService: ColorThemeService
  ) { }

  ngOnInit(): void {
    // Subsribe to color theme changes
    this.colorThemeService.getColorThemeValue().subscribe((value) => {
      if (value == 'light') {
        this.dark = false;
        this.light = true;
      } 
      else {
        this.light = false;
        this.dark = true;
      }
    });
  }

}
