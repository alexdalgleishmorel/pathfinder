import { Component, OnInit } from '@angular/core';
import { TileComponent } from '../tile/tile.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  public innerWidth: any;
  public innerHeight: any;
  public rows: any;
  public cols: any;
  public grid: any;
  public gridInitialized: boolean = false;
  public testArray: string[] = ['alex', 'jack', 'mike', 'holly'];

  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.rows = Math.floor(this.innerHeight/51);
    this.cols = Math.floor(this.innerWidth/51);
    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = [];
    for (var i = 0; i < this.rows; i++) {
      this.grid.push([]);
      for (var j = 0; j < this.cols; j++) {
        this.grid[i].push([i, j]);
      }
    }
    this.gridInitialized = true;
  }
}
