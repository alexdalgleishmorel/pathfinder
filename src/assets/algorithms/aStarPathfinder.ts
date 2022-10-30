

function aStarPathfinder (start: number[], goal: number[], rows: number, cols: number) {
    let gScore: Record<number, number> = {};
    let cameFrom: Record<number, number> = {};
    let fScore: Record<number, number> = {};
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openQueue = new PriorityQueue();
    openQueue.enqueue(start, calcHscore(start, goal));

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    gScore[coordToNumber(start)] = 0;

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    fScore[coordToNumber(start)] = calcHscore(start, goal);

    while (!openQueue.isEmpty()) {
        let current = openQueue.dequeue();
        if (current.element[0] === goal[0] && current.element[1] === goal[1]) {
          return reconstructPath(cameFrom, current.element, start);
        }
        let neighbors = getNeighbors(current.element, rows, cols, gScore);
        for (var i = 0; i < neighbors.length; i++) {
            let neighbor = coordToNumber(neighbors[i]);
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore = gScore[coordToNumber(current.element)] + 1;
            if (tentative_gScore < gScore[neighbor]) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] = coordToNumber(current.element);
                gScore[neighbor] = tentative_gScore;
                fScore[neighbor] = gScore[neighbor] + calcHscore(neighbors[i], goal);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// BEGINNING OF A* PATHFINDING ALGORITHM CODE

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Converts a coordinate to a number
function coordToNumber(coord: number[]) {
    const x = coord[0];
    if (x === 0) {
      return -coord[1];
    }
    const newX = x*10;
    return newX+coord[1];
  }
  
  // converts a number to a coordinate
  function numberToCoordinate(num: number) {
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
  function getNeighbors(node: number[], rows:number, cols:number, gScore: Record<number, number>) {
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
        else if (!(gScore[coordToNumber(neighbors[i])])) {
          // assigning infinite gScore as this node is being instantiated
          gScore[coordToNumber(neighbors[i])] = Infinity;
        }
        validNeighbors.push(neighbors[i]);
    }
    return validNeighbors;
  }
  
  // This function uses the cameFrom dictionary that contains the parent a given node such that the path to
  // this node was the most optimal. The cameFrom dict along with the goal node is given in order to
  // reconstruct the path that has been found from the goal all the way back to the start node
  function reconstructPath(cameFrom: Record<number, number>, current: number[], start: number[]) {
    let total_path = [current];
    while (coordToNumber(current) !== coordToNumber(start)) {
      // Add parent of node to total path list
      current = numberToCoordinate(cameFrom[coordToNumber(current)]);
      total_path.push(current);
    }
    // Flipping total path list so it begins with start coords and ends with goal coords
    return total_path.reverse();
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
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // END OF A* PATHFINDING ALGORITHM CODE
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////