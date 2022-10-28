import { Component, OnInit } from '@angular/core';
import { AStarPathfinderService } from '../services/aStarService/a-star-pathfinder.service';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css']
})
export class ControlButtonsComponent implements OnInit {
  // deleteCount tracks the number of times the user has tried to delete since executing an algorithm,
  // this will be used to determine whether to erase everything, or just the path drawn by the algorithm
  private deleteCount: number = 0;

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
    // Checking if the current state allows for an algorithm to run
    if (this.gridDataService.getExecutePermission()) {
      // Resetting the delete count since new algorithm will be drawn
      this.deleteCount = 0;
      // Executing algorithm
      this.gridDataService.setExecute(true);
      this.aStarService.aStarPathfinder(
        this.gridDataService.getSourceTile(), 
        this.gridDataService.getTargetTile(), 
        this.gridDataService.rows, 
        this.gridDataService.cols
      );
      this.gridDataService.setExecute(false);
    }
  }

  deleteClick() {
    this.deleteCount += 1;
    if (this.deleteCount ==  1) {
      this.gridDataService.resetPath();
      return;
    }
    this.gridDataService.resetAll();
  }
}
