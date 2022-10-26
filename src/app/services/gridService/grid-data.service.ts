import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TILE_SPACE, CONTROL_SPACE } from '../../../assets/constants';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {
  private grid: any;
  private changedTile: any;
  private sourceTile: any;
  private targetTile: any;
  public rows: any;
  public cols: any;

  constructor() {
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    this.rows = Math.floor((innerHeight-CONTROL_SPACE)/TILE_SPACE);
    this.cols = Math.floor(innerWidth/TILE_SPACE);
    this.initializeGrid();
    this.changedTile = new BehaviorSubject<any[]>([]);
    this.sourceTile = new BehaviorSubject<number[]>([]);
    this.targetTile = new BehaviorSubject<number[]>([]);
  }

  initializeGrid() {
    this.grid = [];
    for (var i = 0; i < this.rows; i++) {
      this.grid.push([]);
      for (var j = 0; j < this.cols; j++) {
        this.grid[i].push([i, j]);
      }
    }
  }

  getGrid(): number[] {
    return this.grid;
  }

  getChangedTileValue(): Observable<any[]> {
    return this.changedTile;
  }

  setChangedTileValue(newValue: any[]): void {
    this.changedTile.next(newValue);
  }

  getSourceTileValue(): Observable<any[]> {
    return this.sourceTile;
  }

  setSourceTileValue(newValue: any[]): void {
    this.sourceTile = newValue;
  }

  getTargetTileValue(): Observable<any[]> {
    return this.targetTile;
  }

  setTargetTileValue(newValue: any[]): void {
    this.targetTile = newValue;
  }
}
