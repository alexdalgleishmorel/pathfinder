import { Component, HostListener, Input, OnInit } from '@angular/core';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  public grid: any;

  constructor(private service: GridDataService) { }

  ngOnInit() {
    this.grid = this.service.getGrid();
  }

  @HostListener("mousedown", ["$event"])
  onDown() {
    this.service.setMouseDown(true);
  }

  @HostListener("mouseup", ["$event"])
  onUp() {
    this.service.setMouseDown(false);
  }
}
