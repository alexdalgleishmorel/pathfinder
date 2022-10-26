import { Component, Input, OnInit, Renderer2 } from '@angular/core';
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
  public path: boolean = false;
  public wall: boolean = false;
  public mouseIsDown: boolean = false;

  constructor(
    private gridDataService: GridDataService,
    private renderer2: Renderer2
    ) { }

  ngOnInit(): void {
    this.coordinate = [this.tilePosition[0], this.tilePosition[1]];

    // Checking for when a tile is discovered by a search algorithm, and changing its color when this occurs
    this.gridDataService.getChangedTileValue().subscribe((value) => {
      if(this.coordinate[0] == value[0] && this.coordinate[1] == value[1] && !(this.source || this.target)) {
        this.default = false;
        if (value[2] == 0) {
          this.default = false;
          this.searched = true;
        }
        else if (value[2] == 1) {
          this.default = false;
          this.searched = false;
          this.path = true;
        }
      }
      else if (value[0] == -1) {
        this.gridDataService.setWallTile(this.coordinate, 0);
        this.default = true;
        this.searched = false;
        this.path = false;
        this.wall = false;
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
      this.wall = false;
      this.searched = false;
      this.source = true;
    }
    // If the user is currently choosing a target tile, then set the target tile value to be this tile's
    else if (this.gridDataService.targetSelect) {
      this.gridDataService.setTargetTileValue(this.coordinate);
      this.default = false;
      this.source = false;
      this.wall = false;
      this.searched = false;
      this.target = true;
    }
    // If the user is currently choosing a wall tile, then set a wall tile value to be this tile's
    else if (this.gridDataService.wallSelect) {
      this.gridDataService.setWallTile(this.coordinate, -1);
      this.default = false;
      this.source = false;
      this.target = false;
      this.searched = false;
      this.wall = true;
    }
  }

  onHover() {
    if (this.gridDataService.wallSelect) {
      this.default = false;
      this.source = false;
      this.target = false;
      this.searched = false;
      this.wall = true;
    }
  }
}
