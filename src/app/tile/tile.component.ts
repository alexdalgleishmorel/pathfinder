import { Component, Input, OnInit } from '@angular/core';
import { GridDataService } from '../grid-data.service';

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

  constructor(private service: GridDataService) { }

  ngOnInit(): void {
    this.rowNumber = this.tilePosition[0];
    this.colNumber = this.tilePosition[1];

    this.service.getChangedTileValue().subscribe((value) => {
      if(this.rowNumber == value[0] && this.colNumber == value[1]) {
        console.log('%s is equal to %s', [this.rowNumber, this.colNumber], value);
        this.default = false;
        this.searched = true;
        console.log(this.searched);
      }
    });
  }

  onClick() {
    this.target = true;
    this.default = false;

    console.log(this.service.aStarPathfinder([this.rowNumber, this.colNumber], [5,5], 18, 37));
  }
}
