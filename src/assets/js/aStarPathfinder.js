let gScore = {};

function aStarPathfinder (start, goal, rows, cols) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openQueue = new PriorityQueue();
    openQueue.enqueue(start, calcHscore(start, goal));

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    let cameFrom = {};

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    gScore[start] = 0;

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how short a path from start to finish can be if it goes through n.
    let fScore = {};
    fScore[start] = calcHscore(start, goal);

    while (!openQueue.isEmpty()) {
        let current = openQueue.dequeue();
        if (current.element[0] === goal[0] && current.element[1] === goal[1]) {
            return reconstructPath(cameFrom, current.element);
        }
        let neighbors = getNeighbors(current.element, rows, cols);
        for (var i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            // tentative_gScore is the distance from start to the neighbor through current
            let tentative_gScore = gScore[current.element] + 1;
            if (tentative_gScore < gScore[neighbor]) {
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] = current.element;
                gScore[neighbor] = tentative_gScore;
                fScore[neighbor] = gScore[neighbor] + calcHscore(neighbor, goal);
                if (!openQueue.contains(neighbor, fScore[neighbor])) {
                    openQueue.enqueue(neighbor, fScore[neighbor]);
                }
            }
        }
    }
    // Open set is empty but goal was never reached
    return false;
}

// Establishes neighbors of the given node
function getNeighbors(node, rows, cols) {
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
        else if (!(neighbors[i] in gScore)) {
            // assigning infinite gScore as this node is being instantiated
            gScore[neighbors[i]] = Infinity;
        }
        validNeighbors.push(neighbors[i]);
    }
    return validNeighbors;
}

// This function uses the cameFrom dictionary that contains the parent a given node such that the path to
// this node was the most optimal. The cameFrom dict along with the goal node is given in order to
// reconstruct the path that has been found from the goal all the way back to the start node
function reconstructPath(cameFrom, current) {
    let total_path = [current];
    while (current in cameFrom) {
        // Add parent of node to total path list
        current = cameFrom[current];
        total_path.push(current);
    }
    // Flipping total path list so it begins with start coords and ends with goal coords
    return total_path.reverse();
}

// Calculates the h score of the given node based on the hypotenuse between the given coordinates
function calcHscore(coord, goal) {
    let x1 = coord[0];
    let y1 = coord[1];
    let x2 = goal[0];
    let y2 = goal[1];
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);
    return (Math.sqrt((x**2)+(y**2))) * 10;
}


// User defined class
// to store element and its priority
class QElement {
	constructor(element, priority)
	{
		this.element = element;
		this.priority = priority;
	}
}

// PriorityQueue class
class PriorityQueue {

	// An array is used to implement priority
	constructor()
	{
		this.items = [];
	}

	// functions to be implemented
	// enqueue(item, priority)
    // enqueue function to add element to the queue as per priority
    enqueue(element, priority)
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

    contains(element, priority)
    {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].element == element && this.items[i].priority == priority) {
                return true;
            }
        }
        return false;
    }
}