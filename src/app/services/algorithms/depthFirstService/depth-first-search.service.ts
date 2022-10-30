import { Injectable } from '@angular/core';
import { GridDataService } from '../../gridService/grid-data.service';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

@Injectable({
  providedIn: 'root'
})
export class DepthFirstSearchService {

  public sleepTime: number = 10;

  constructor(
    private gridDataService: GridDataService
    ) { }

  async depthFirstPathfinder (start: number[], goal: number[], rows: number, cols: number) {
    // Creating a grid representation
    let grid: any = createGrid(rows, cols);

    // Creating a FIFO queue using an array, with the start node in it to begin
    let startElement = grid[start[0]][start[1]];
    startElement.visited = true;
    let queue: any[] = [startElement];

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    let cameFrom: Record<string, string> = {};

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    let gScore: Record<string, number> = {};
    gScore[(coordToString(start))] = 0;

    // Keep visiting nodes until all have been visited, or a solution is found
    while (queue.length != 0) {
      console.log(queue);
      // Using the queue as a STACK, by popping the last element that was added
      let current: any = queue.pop();

      // Updating UI with the new searched tile
      this.updateTile(current.element, 0);

      if (current.element[0] == goal[0] && current.element[1] == goal[1]) {
        return this.reconstructPath(cameFrom, current.element, start);
      }

      // Get the neighbors in each direction of the current node being inspected
      let neighbors = this.getNeighbors(current.element, rows, cols, gScore);
      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = grid[neighbors[i][0]][neighbors[i][1]];

        let tentative_gScore = gScore[coordToString(current.element)] + 1;

        if (!neighbor.visited) {
          if (tentative_gScore < gScore[coordToString(neighbor.element)]) {
            gScore[coordToString(neighbor.element)] = tentative_gScore;
            cameFrom[coordToString(neighbor.element)] = coordToString(current.element);
          }
          neighbor.visited = true;
          queue.push(neighbor);
        }
        // Sleep to animate the algorithm on UI
        await sleep(this.sleepTime);
      }
    }

    // If we reach this point, no node was able to be found
    return false;
  }

  // This function uses the cameFrom dictionary that contains the parent a given node such that the path to
  // this node was the most optimal. The cameFrom dict along with the goal node is given in order to
  // reconstruct the path that has been found from the goal all the way back to the start node
  async reconstructPath(cameFrom: Record<string, string>, current: number[], start: number[]) {
    let total_path = [current];
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
    let neighbors = [[x, (y-1)], [(x+1), y], [x, (y+1)], [(x-1), y]]; // N E S W
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

// Stores an element, its priority, and whether is has been visited before
class QElement {
  public element;
  public visited;
  constructor(element: number[], visited: boolean)
  {
    this.element = element;
    this.visited = visited;
  }
}

// Creates a grid of QElements
function createGrid(rows: number, cols: number) {
  let grid: any = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[i].push(new QElement([i,j], false));
    }
  }
  return grid;
}
