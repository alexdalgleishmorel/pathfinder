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
  public rowNumber: number = 0;
  public colNumber: number = 0;
  public default: boolean = true;
  public source: boolean = false;
  public target: boolean = false; 
  public searched: boolean = false;

  constructor(
    private gridDataService: GridDataService,
    private aStarPathfinderService: AStarPathfinderService
    ) { }

  ngOnInit(): void {
    this.rowNumber = this.tilePosition[0];
    this.colNumber = this.tilePosition[1];

    this.gridDataService.getChangedTileValue().subscribe((value) => {
      if(this.rowNumber == value[0] && this.colNumber == value[1]) {
        this.default = false;
        this.searched = true;
      }
    });
  }

  onClick() {
    this.target = true;
    this.default = false;

    console.log(this.aStarPathfinderService.aStarPathfinder([this.rowNumber, this.colNumber], [5,5], 18, 37));
  }
}
