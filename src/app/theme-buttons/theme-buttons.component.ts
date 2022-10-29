import { Component, OnInit } from '@angular/core';
import { ColorThemeService } from '../services/colorThemeService/color-theme.service';

@Component({
  selector: 'app-theme-buttons',
  templateUrl: './theme-buttons.component.html',
  styleUrls: ['./theme-buttons.component.css']
})
export class ThemeButtonsComponent implements OnInit {

  constructor(
    private colorThemeService: ColorThemeService
    ) { }

  ngOnInit(): void {
  }

  onLightModeClick() {
    document.body.style.background = '#E1D9D1';
    this.colorThemeService.setColorThemeValue('light');
  }

  onDarkModeClick () {
    document.body.style.background = 'black';
    this.colorThemeService.setColorThemeValue('dark');
  }
}
