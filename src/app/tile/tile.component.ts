import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ColorThemeService } from '../services/colorThemeService/color-theme.service';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() tilePosition: any;
  // The coordinate of this tile
  public coordinate: number[] = [];

  // The possible roles of this tile on the grid
  public default: boolean = true;
  public source: boolean = false;
  public target: boolean = false;
  public active: boolean = false;
  public searched: boolean = false;
  public path: boolean = false;
  public wall: boolean = false;

  // Color theme options
  public light: boolean = false;
  public dark: boolean = true;

  // A value that tracks if the user is holding down the mouse
  public mouseIsDown: boolean = false;

  constructor(
    private gridDataService: GridDataService,
    private colorThemeService: ColorThemeService
    ) { }

  ngOnInit(): void {
    this.coordinate = [this.tilePosition[0], this.tilePosition[1]];

    // Subsribe to color theme changes
    this.colorThemeService.getColorThemeValue().subscribe((value) => {
      if (value == 'light') {
        this.dark = false;
        this.light = true;
      } 
      else {
        this.light = false;
        this.dark = true;
      }
    });

    // Checking for when a tile is discovered by a search algorithm, and changing its color when this occurs
    this.gridDataService.getChangedTileValue().subscribe((value) => {
      // Checking if this tile has been notified to change, and confirming it isn't the source or target tile
      if(this.coordinate[0] == value[0] && this.coordinate[1] == value[1] && !(this.source || this.target)) {
        
        this.default = false;

        // Checking the third index of value to determine what to do with the changed tile
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
      // If the changed tile value is -1, this signals a reset of the grid, and all tiles change back to default
      else if (value[0] == -1) {
        this.gridDataService.setWallTile(this.coordinate, 0);
        this.default = true;
        this.searched = false;
        this.path = false;
        this.wall = false;
      }
      // If the changed tile value is -2, this signals a reset of the pathway drawn by the algorithm, so searched and path tiles change back to default
      else if (value[0] == -2 && (this.searched || this.path)) {
        this.searched = false;
        this.path = false;
        this.default = true;
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

  // Describes possible actions to take when a tile is selected
  onSelect() {
    this.trySourceDraw();
    this.tryTargetDraw();
    this.tryWallDraw(true);
  }

  // Describes possible actions to take when a tile is hovered on
  onHover() {
    this.tryWallDraw(false);
  }

  // Sets this tile to be the source if the current state allows for it
  trySourceDraw() {
    // If the user is currently choosing a source tile, then set the source tile value to be this tile's
    if (this.gridDataService.sourceSelect) {
      this.gridDataService.setSourceTileValue(this.coordinate);
      this.default = false;
      this.target = false;
      this.wall = false;
      this.searched = false;
      this.source = true;
    }
  }

  // Sets this tile to be the target if the current state allows for it
  tryTargetDraw() {
    // If the user is currently choosing a target tile, then set the target tile value to be this tile's
    if (this.gridDataService.targetSelect) {
      this.gridDataService.setTargetTileValue(this.coordinate);
      this.default = false;
      this.source = false;
      this.wall = false;
      this.searched = false;
      this.target = true;
    }
  }

  // Sets this tile to be a wall if the current state allows for it
  tryWallDraw(click: boolean) {
    // If the user is currently choosing a wall tile, via click or drag, then set a wall tile value to be this tile's
    if (this.gridDataService.wallSelect && (this.gridDataService.getMouseDown() || click)) {
      this.source = false;
      this.target = false;
      this.searched = false;
      if (!this.wall) {
        this.gridDataService.setWallTile(this.coordinate, -1);
        this.default = false;
        this.wall = true;
      }
      else {
        this.gridDataService.setWallTile(this.coordinate, 0);
        this.default = true;
        this.wall = false;
      }
    }
  }
}
