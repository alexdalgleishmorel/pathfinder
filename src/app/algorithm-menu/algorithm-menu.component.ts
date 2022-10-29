import { Component, OnInit } from '@angular/core';
import { ALGORITHMS } from 'src/assets/constants';
import { GridDataService } from '../services/gridService/grid-data.service';

@Component({
  selector: 'app-algorithm-menu',
  templateUrl: './algorithm-menu.component.html',
  styleUrls: ['./algorithm-menu.component.css'],
})
export class AlgorithmMenuComponent implements OnInit {

  public algorithms: string[] = ALGORITHMS;
  public lightLabel: boolean = false;
  public darkLabel: boolean = true;

  constructor(private gridDataService: GridDataService) { }

  ngOnInit(): void {
  }

  algorithmSelected(algorithm: string) {
    console.log('NEW ALGORITHM SELECTED');
    this.gridDataService.setAlgorithm(algorithm);
  }

}
