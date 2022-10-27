import { Component, OnInit } from '@angular/core';
import { ALGORITHMS } from 'src/assets/constants';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-algorithm-menu',
  templateUrl: './algorithm-menu.component.html',
  styleUrls: ['./algorithm-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AlgorithmMenuComponent implements OnInit {

  public algorithms: string[] = ALGORITHMS;
  public lightLabel: boolean = false;
  public darkLabel: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
