import { Injectable } from '@angular/core';
import { GridDataService } from '../../gridService/grid-data.service';
import { PriorityQueueService } from '../../priorityQueueService/priority-queue.service';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Injectable({
  providedIn: 'root'
})
export class DijkstraServiceService {

  public sleepTime: number = 10;

  constructor(
    private priorityQueueService: PriorityQueueService,
    private gridDataService: GridDataService
  ) { }

  /**
   * This pathfinder is the building block of the A* Pathfinding algorithm, its only difference is that it ranks
   * neighbors by their distance from the start to the current node, and nothing more. This lack of a heuristic function
   * can make it slightly less efficient, but it guarantees correctness (the shortest path).
   * 
   */
  async dijkstraPathfinder (start: number[], goal: number[], rows: number, cols: number) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openQueue = this.priorityQueueService.getPriorityQueue();
    openQueue.enqueue(start, calcHscore(start, goal));
  
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    let cameFrom: Record<string, string> = {};
  
    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore: Record<string, number> = {};
    gScore[coordToString(start)] = 0;

    // Continue searching until no more neighbors can be inspected, or the goal is found
    while (!openQueue.isEmpty()) {
        let current = openQueue.dequeue();
        // If we have reached the goal, we can reconstruct the path and exit
        if (current.element[0] === goal[0] && current.element[1] === goal[1]) {
          return this.reconstructPath(cameFrom, current.element, start);
        }

        // Get the neighbors in each direction of the current node being inspected
        let neighbors = this.getNeighbors(current.element, rows, cols, gScore);
        for (var i = 0; i < neighbors.length; i++) {
          let neighbor = coordToString(neighbors[i]);

          // tentative_gScore is the distance from start to the neighbor through current
          let tentative_gScore = gScore[coordToString(current.element)] + 1;
          if (tentative_gScore < gScore[neighbor]) {
              // This path to neighbor is better than any previous one. Record it!
              cameFrom[neighbor] = coordToString(current.element);
              gScore[neighbor] = tentative_gScore;

              if (!openQueue.contains(neighbors[i], tentative_gScore)) {
                  openQueue.enqueue(neighbors[i], tentative_gScore);

                  // Updating UI with the new searched tile
                  this.updateTile(neighbors[i], 0);
              }
          }
          await sleep(this.sleepTime);
        }
    }
    // Open set is empty but goal was never reached
    return false;
  }

  // This function uses the cameFrom dictionary that contains the parent a given node such that the path to
  // this node was the most optimal. The cameFrom dict along with the goal node is given in order to
  // reconstruct the path that has been found from the goal all the way back to the start node
  async reconstructPath(cameFrom: Record<string, string>, current: number[], start: number[]) {
    let total_path = [current];
    console.log('source %s dest %s', start, current);
    console.log(cameFrom);
    while (coordToString(current) !== coordToString(start)) {
      // Add parent of node to total path list
      current = stringToCoordinate(cameFrom[coordToString(current)]);
      total_path.push(current);

      // Update the user interface
      this.updateTile(current, 1);

      // Sleep to animate the algorithm on UI
      await sleep(this.sleepTime);
    }
    // Flipping total path list so it begins with start coords and ends with goal coords
    return total_path.reverse();
  }

  // Establishes neighbors of the given node
  getNeighbors(node: number[], rows:number, cols:number, gScore: Record<string, number>) {
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
        else if (this.gridDataService.checkIfWallTile([x,y])) {
          // ensuring the algorithm skips over tiles that are walls
          continue;
        }
        else if (!(gScore[coordToString(neighbors[i])])) {
          // assigning infinite gScore as this node is being instantiated
          gScore[coordToString(neighbors[i])] = Infinity;
        }
        validNeighbors.push(neighbors[i]);
    }
    return validNeighbors;
  }

  updateTile(coord: number[], value: number) {
    coord.push(value);
    this.gridDataService.setChangedTileValue(coord);
  }
}

// Converts a coordinate to a string
function coordToString(coord: number[]) {
  let xString = coord[0].toString();
  let yString = coord[1].toString();
  xString = xString.concat(',');
  let stringCoord = xString.concat((yString));
  return stringCoord;
}

// converts a string to a coordinate
function stringToCoordinate(coord: string) {
  let coordStrings = coord.split(',');
  let xNumber = +(coordStrings[0]);
  let yNumber = +(coordStrings[1]);
  return [xNumber, yNumber];
}

// Calculates the h score of the given node based on the hypotenuse between the given coordinates
function calcHscore(coord: number[], goal: number[]) {
    let x1 = coord[0];
    let y1 = coord[1];
    let x2 = goal[0];
    let y2 = goal[1];
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);
    return (Math.sqrt((x**2)+(y**2))) * 10;
}
