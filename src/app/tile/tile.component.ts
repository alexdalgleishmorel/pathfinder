import { Component, Input, OnInit } from '@angular/core';
import { AStarPathfinderService } from '../services/aStarService/a-star-pathfinder.service';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() tilePosition: any;
  public coordinate: number[] = [];
  public default: boolean = true;
  public source: boolean = false;
  public target: boolean = false; 
  public searched: boolean = false;

  constructor(
    private gridDataService: GridDataService
    ) { }

  ngOnInit(): void {
    this.coordinate = [this.tilePosition[0], this.tilePosition[1]];

    // Checking for when a tile is discovered by a search algorithm, and changing its color when this occurs
    this.gridDataService.getChangedTileValue().subscribe((value) => {
      if(this.coordinate[0] == value[0] && this.coordinate[1] == value[1]) {
        this.default = false;
        this.searched = true;
      }
    });

    // Checking for when a tile is set to the source, and it isn't this one, making sure this tile now becomes default color
    this.gridDataService.getSourceTileValue().subscribe((value) => {
      if((this.coordinate[0] !== value[0] || this.coordinate[1] !== value[1]) && this.source) {
        this.default = true;
        this.source = false;
        this.target = false;
      }
    });

    // Checking for when a tile is set to the target, and it isn't this one, making sure this tile now becomes default color
    this.gridDataService.getTargetTileValue().subscribe((value) => {
      if((this.coordinate[0] !== value[0] || this.coordinate[1] !== value[1]) && this.target) {
        this.default = true;
        this.source = false;
        this.target = false;
      }
    });
  }

  onClick() {
    // If the user is currently choosing a source tile, then set the source tile value to be this tile's
    if (this.gridDataService.sourceSelect) {
      this.gridDataService.setSourceTileValue(this.coordinate);
      this.default = false;
      this.target = false;
      this.source = true;
    }
    // If the user is currently choosing a target tile, then set the target tile value to be this tile's
    else if (this.gridDataService.targetSelect) {
      this.gridDataService.setTargetTileValue(this.coordinate);
      this.default = false;
      this.source = false;
      this.target = true;
    }
  }
}
