import { Component, Input, OnInit } from '@angular/core';
declare function aStarPathfinder(start: any, goal:any, rows:number, cols:number): any;

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() tilePosition: any;
  public rowNumber: number = 0;
  public colNumber: number = 0;
  public default: boolean = true;
  public source: boolean = false;
  public target: boolean = false; 

  constructor() { }

  ngOnInit(): void {
    this.rowNumber = this.tilePosition[0];
    this.colNumber = this.tilePosition[1];
  }

  onClick() {
    this.target = true;
    this.default = false;

    console.log(aStarPathfinder([this.rowNumber, this.colNumber], [5,5], 18, 37));
  }
}
