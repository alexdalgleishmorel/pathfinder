import { Component, OnInit } from '@angular/core';
import { AStarPathfinderService } from '../services/aStarService/a-star-pathfinder.service';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent implements OnInit {

  constructor(
    private gridDataService: GridDataService,
    private aStarService: AStarPathfinderService
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
    if (this.gridDataService.getExecutePermission()) {
      this.gridDataService.setExecute(true);
      console.log(this.aStarService.aStarPathfinder(
        this.gridDataService.getSourceTile(), 
        this.gridDataService.getTargetTile(), 
        this.gridDataService.rows, 
        this.gridDataService.cols
      ));
      this.gridDataService.setExecute(false);
    }
  }

  deleteClick() {
    this.gridDataService.reset();
  }
}
