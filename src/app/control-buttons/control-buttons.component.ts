import { Component, OnInit } from '@angular/core';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent implements OnInit {

  constructor(
    private gridDataService: GridDataService
  ) { }

  ngOnInit(): void {
  }

  sourceClick () {
    this.gridDataService.enableSourceSelect();
  }

  targetClick () {
    this.gridDataService.enableTargetSelect();
  }

  wallClick () {
    this.gridDataService.enableWallSelect();
  }

  executeClick () {

  }

}
