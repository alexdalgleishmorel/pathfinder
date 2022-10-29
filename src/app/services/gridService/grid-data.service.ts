import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TILE_SPACE, CONTROL_SPACE } from '../../../assets/constants';
import { AStarPathfinderService } from '../algorithms/aStarService/a-star-pathfinder.service';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  // GRID ATTRIBUTES
  private grid: any;
  public rows: any;
  public cols: any;
  // A tile that has its color changed during an algorithm execution
  private changedTile: any;
  // The tile where an algorithm begins from
  private sourceTile: any;
  private sourceTileObservable: any;
  // The tile that an algorithm attempts to reach
  private targetTile: any;
  private targetTileObservable: any;

  // CONTROL ATTRIBUTES
  private sourceSelected: boolean = false;
  public sourceSelect: boolean = false;
  private targetSelected: boolean = false;
  public targetSelect: boolean = false;
  public executingAlgorithm: boolean = false;
  public wallSelect: boolean = false;
  public mouseDown: boolean = false;

  // ALGORITHM VALUES
  public algorithmSelected: boolean = false;
  public algorithmName: string = "";

  constructor() {

    // Determining the window size
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    // Determing the number of tiles to create based on the window size
    this.rows = Math.floor((innerHeight-CONTROL_SPACE)/TILE_SPACE);
    this.cols = Math.floor(innerWidth/TILE_SPACE);

    // Creating a grid representation based on the window size
    this.initializeGrid();

    // Creating observables for the tiles, for the tile components to monitor and update their statuses
    this.changedTile = new BehaviorSubject<any[]>([]);
    this.sourceTileObservable = new BehaviorSubject<any[]>([]);
    this.targetTileObservable = new BehaviorSubject<any[]>([]);
    this.sourceTile = [];
    this.targetTile = [];
  }

  // Creating a grid representation that an algorithm will navigate
  initializeGrid() {
    this.grid = [];
    for (var i = 0; i < this.rows; i++) {
      this.grid.push([]);
      for (var j = 0; j < this.cols; j++) {
        this.grid[i].push([i, j]);
      }
    }
  }

  // Return the current grid representation
  getGrid(): number[] {
    return this.grid;
  }

  // Get an observable of the most recent tile that was touched by the algorithm, for the tile component to monitor
  getChangedTileValue(): Observable<any[]> {
    return this.changedTile;
  }

  // Allows an algorithm to notify when it has searched a specific tile, and in turn the tile component can be notified
  setChangedTileValue(newValue: any[]): void {
    this.changedTile.next(newValue);
  }

  // Get an observable of the tile from which the algorithm will start, for the tile component to monitor
  getSourceTileValue(): Observable<any[]> {
    return this.sourceTileObservable;
  }

  // Get the actual source tile value, rather than an observable
  getSourceTile() {
    return this.sourceTile;
  }

  // Allows notification of when a source tile has been chosen, and in turn the tile components will be notified
  setSourceTileValue(newValue: any[]): void {
    this.sourceSelected = true;
    this.sourceTile = newValue;
    this.sourceTileObservable.next(newValue);
  }

  // Get an observable of the tile from which the algorithm will complete, for the tile component to monitor
  getTargetTileValue(): Observable<any[]> {
    return this.targetTileObservable;
  }

  // Get the actual target tile value, rather than an observable
  getTargetTile() {
    return this.targetTile;
  }

  // Allows notification of when a target tile has been chosen, and in turn the tile components will be notified
  setTargetTileValue(newValue: any[]): void {
    this.targetSelected = true;
    this.targetTile = newValue;
    this.targetTileObservable.next(newValue);
  }

  // Updates the grid representation in terms of where a wall may be for an algorithm to navigate around
  setWallTile(coord: number[], value: number) {
    this.grid[coord[0]][coord[1]][0] = value;
    this.grid[coord[0]][coord[1]][1] = value;
  }

  // Determines if the given tile is a wall, based on the grid representation
  checkIfWallTile(coord: number[]) {
    return (this.grid[coord[0]][coord[1]][0] == -1 && this.grid[coord[0]][coord[1]][1] == -1);
  }

  // Enables source select, which allows the user to click a tile they want to be the source for the algorithm
  enableSourceSelect(): void {
    this.targetSelect = false;
    this.wallSelect = false;
    this.sourceSelect = true;
  }

  // Enables target select, which allows the user to click a tile they want to be the target for the algorithm
  enableTargetSelect(): void {
    this.sourceSelect = false;
    this.wallSelect = false;
    this.targetSelect = true;
  }

  // Enables source select, which allows the user to choose tiles they want to be a wall for the algorithm
  enableWallSelect(): void {
    this.sourceSelect = false;
    this.targetSelect = false;
    this.wallSelect = true;
  }

  // This determines if an algorithm is currently allowed to execute
  setExecute(bool: boolean) {
    this.executingAlgorithm = bool;
  }

  // Checks that the current state is acceptable to allow algorithm execution
  getExecutePermission() {
    return !this.executingAlgorithm && this.sourceSelected && this.targetSelected && this.algorithmSelected;
  }

  // This resets all control values, in order for the user to create a new state
  resetAll() {
    this.setSourceTileValue([]);
    this.sourceSelected = false;
    this.setTargetTileValue([]);
    this.targetSelected = false;
    this.setChangedTileValue([-1, -1]);
  }

  // This resets only the tiles drawn by the algorithm back to their defaults
  resetPath() {
    this.setChangedTileValue([-2, -2]);
  }

  // This sets the mouseDown boolean attribute. It should be true when the user is holding a click, and false when they release a click
  setMouseDown(bool: boolean) {
    this.mouseDown = bool;
  }

  // This determines if the user is currently holding down the click button on their mouse
  getMouseDown() {
    return this.mouseDown;
  }

  // Returns the current algorithm selected by the user
  getAlgorithm() {
    return this.algorithmName;
  }

  // Sets the algorithm to be used
  setAlgorithm(algorithmName: string) {
    this.algorithmSelected = true;
    this.algorithmName = algorithmName;
  }
}
