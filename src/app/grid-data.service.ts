import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {
  private grid: any;
  private changedTile: any;
  private sourceTile: any;
  private targetTile: any;
  public innerWidth: any;
  public innerHeight: any;
  public rows: any;
  public cols: any;

  constructor() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.rows = Math.floor(this.innerHeight/51);
    this.cols = Math.floor(this.innerWidth/51);
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // BEGINNING OF A* PATHFINDING ALGORITHM
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  aStarPathfinder (start: number[], goal: number[], rows: number, cols: number) {
    let gScore: Record<number, number> = {};
    let cameFrom: Record<number, number> = {};
    let fScore: Record<number, number> = {};
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openQueue = new PriorityQueue();
    openQueue.enqueue(start, this.calcHscore(start, goal));

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    gScore[this.coordToNumber(start)] = 0;

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    fScore[this.coordToNumber(start)] = this.calcHscore(start, goal);

    while (!openQueue.isEmpty()) {
        let current = openQueue.dequeue();
        if (current.element[0] === goal[0] && current.element[1] === goal[1]) {
          return this.reconstructPath(cameFrom, current.element, start);
        }
        let neighbors = this.getNeighbors(current.element, rows, cols, gScore);
        for (var i = 0; i < neighbors.length; i++) {
            let neighbor = this.coordToNumber(neighbors[i]);
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore = gScore[this.coordToNumber(current.element)] + 1;
            if (tentative_gScore < gScore[neighbor]) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] = this.coordToNumber(current.element);
                gScore[neighbor] = tentative_gScore;
                fScore[neighbor] = gScore[neighbor] + this.calcHscore(neighbors[i], goal);
                if (!openQueue.contains(neighbors[i], fScore[neighbor])) {
                    openQueue.enqueue(neighbors[i], fScore[neighbor]);
                    this.setChangedTileValue(neighbors[i]);
                }
            }
        }
    }
    // Open set is empty but goal was never reached
    return false;
  }

  // Converts a coordinate to a number
  coordToNumber(coord: number[]) {
    const x = coord[0];
    if (x === 0) {
      return -coord[1];
    }
    const newX = x*10;
    return newX+coord[1];
  }

  // converts a number to a coordinate
  numberToCoordinate(num: number) {
    if (num === 0) {
      return [0, 0];
    }
    if (num < 0) {
      return [0, -num];
    }
    const y = num%10;
    const x = (num-y)/10;
    return [x, y];
  }

  // Establishes neighbors of the given node
  getNeighbors(node: number[], rows:number, cols:number, gScore: Record<number, number>) {
    let x = node[0];
    let y = node[1];
    
    // Initially setting all 4 directions from node to be neighbors
    let neighbors = [[(x+1), y], [(x-1), y], [x, (y-1)], [x, (y+1)]]; // E W N S
    let validNeighbors = [];

    for (var i = 0; i < 4; i++) {
        let x = neighbors[i][0];
        let y = neighbors[i][1];
        if (x < 0 || x >= rows) {
            // ensuring neighbors not in bounds of grid are not added
            continue;
        }
        else if (y < 0 || y >= cols) {
            // ensuring neighbors not in bounds of grid are not added
            continue;
        }
        else if (!(gScore[this.coordToNumber(neighbors[i])])) {
          // assigning infinite gScore as this node is being instantiated
          gScore[this.coordToNumber(neighbors[i])] = Infinity;
        }
        validNeighbors.push(neighbors[i]);
    }
    return validNeighbors;
  }

  // This function uses the cameFrom dictionary that contains the parent a given node such that the path to
  // this node was the most optimal. The cameFrom dict along with the goal node is given in order to
  // reconstruct the path that has been found from the goal all the way back to the start node
  reconstructPath(cameFrom: Record<number, number>, current: number[], start: number[]) {
    let total_path = [current];
    while (this.coordToNumber(current) !== this.coordToNumber(start)) {
      // Add parent of node to total path list
      current = this.numberToCoordinate(cameFrom[this.coordToNumber(current)]);
      total_path.push(current);
    }
    // Flipping total path list so it begins with start coords and ends with goal coords
    return total_path.reverse();
  }

  // Calculates the h score of the given node based on the hypotenuse between the given coordinates
  calcHscore(coord: number[], goal: number[]) {
      let x1 = coord[0];
      let y1 = coord[1];
      let x2 = goal[0];
      let y2 = goal[1];
      let x = Math.abs(x1 - x2);
      let y = Math.abs(y1 - y2);
      return (Math.sqrt((x**2)+(y**2))) * 10;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // END OF A* PATHFINDING ALGORITHM
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

// User defined class
// to store element and its priority
class QElement {
  public element;
  public priority;
  constructor(element: number[], priority: number)
  {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
class PriorityQueue {
  public items: any;

  // An array is used to implement priority
  constructor()
  {
    this.items = [];
  }

  // functions to be implemented
  // enqueue(item, priority)
    // enqueue function to add element to the queue as per priority
    enqueue(element: number[], priority: number)
    {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

  // dequeue()
    // dequeue method to remove
    // element from the queue
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

  // front()
    // front function
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    // rear function
    rear()
    {
        // returns the lowest priority
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }

  // isEmpty()
    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

  // printPQueue()
    // prints all the element of the queue
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }

    contains(element: number[], priority: number)
    {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].element == element && this.items[i].priority == priority) {
                return true;
            }
        }
        return false;
    }
  }
