import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { GridComponent } from './grid/grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControlButtonsComponent } from './control-buttons/control-buttons.component';
import { AlgorithmMenuComponent } from './algorithm-menu/algorithm-menu.component';
import { ThemeButtonsComponent } from './theme-buttons/theme-buttons.component';
import { TitleComponent } from './title/title.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    GridComponent,
    ControlButtonsComponent,
    AlgorithmMenuComponent,
    ThemeButtonsComponent,
    TitleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
