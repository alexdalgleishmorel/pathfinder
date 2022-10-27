import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TILE_SPACE, CONTROL_SPACE } from '../../../assets/constants';
import { AStarPathfinderService } from '../aStarService/a-star-pathfinder.service';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {
  private grid: any;
  private changedTile: any;
  private sourceTile: any;
  private targetTile: any;
  private sourceTileObservable: any;
  private targetTileObservable: any;
  private enableSource: boolean = true;
  private sourceSelected: boolean = false;
  public sourceSelect: boolean = false;
  private enableTarget: boolean = true;
  private targetSelected: boolean = false;
  public targetSelect: boolean = false;
  public executingAlgorithm: boolean = false;
  private enableWall: boolean = true;
  public wallSelect: boolean = false;
  public rows: any;
  public cols: any;
  public mouseDown: boolean = false;

  constructor() {
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    this.rows = Math.floor((innerHeight-CONTROL_SPACE)/TILE_SPACE);
    this.cols = Math.floor(innerWidth/TILE_SPACE);
    this.initializeGrid();
    this.changedTile = new BehaviorSubject<any[]>([]);
    this.sourceTileObservable = new BehaviorSubject<any[]>([]);
    this.targetTileObservable = new BehaviorSubject<any[]>([]);
    this.sourceTile = [];
    this.targetTile = [];
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
    return this.sourceTileObservable;
  }

  getSourceTile() {
    return this.sourceTile;
  }

  setSourceTileValue(newValue: any[]): void {
    this.sourceSelected = true;
    this.sourceTile = newValue;
    this.sourceTileObservable.next(newValue);
  }

  getTargetTileValue(): Observable<any[]> {
    return this.targetTileObservable;
  }

  getTargetTile() {
    return this.targetTile;
  }

  setTargetTileValue(newValue: any[]): void {
    this.targetSelected = true;
    this.targetTile = newValue;
    this.targetTileObservable.next(newValue);
  }

  setWallTile(coord: number[], value: number) {
    this.grid[coord[0]][coord[1]][0] = value;
    this.grid[coord[0]][coord[1]][1] = value;
  }

  checkIfWallTile(coord: number[]) {
    return (this.grid[coord[0]][coord[1]][0] == -1 && this.grid[coord[0]][coord[1]][1] == -1);
  }

  enableSourceSelect(): void {
    this.targetSelect = false;
    this.wallSelect = false;
    this.sourceSelect = true;
  }

  enableTargetSelect(): void {
    this.sourceSelect = false;
    this.wallSelect = false;
    this.targetSelect = true;
  }

  enableWallSelect(): void {
    this.sourceSelect = false;
    this.targetSelect = false;
    this.wallSelect = true;
  }

  setExecute(bool: boolean) {
    this.executingAlgorithm = bool;
  }

  getExecutePermission() {
    console.log(!this.executingAlgorithm, this.sourceSelected, this.targetSelected);
    return !this.executingAlgorithm && this.sourceSelected && this.targetSelected;
  }

  reset() {
    this.setSourceTileValue([]);
    this.sourceSelected = false;
    this.setTargetTileValue([]);
    this.targetSelected = false;
    this.setChangedTileValue([-1, -1]);
  }

  setMouseDown (bool: boolean) {
    this.mouseDown = bool;
  }

  getMouseDown () {
    return this.mouseDown;
  }
}
