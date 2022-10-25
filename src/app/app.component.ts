import { Component } from '@angular/core';
import { ALGORITHMS } from 'src/assets/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public algorithms: string[] = ALGORITHMS;
}
