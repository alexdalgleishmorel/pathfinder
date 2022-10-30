const TILE_SIZE: Number = 15;
const TILE_PADDING: Number = 2.5;
export const TILE_SPACE = (TILE_SIZE.valueOf()+(2*TILE_PADDING.valueOf()));
export const CONTROL_SPACE = 250;
export const ALGORITHMS = ["Breadth First Search", "Depth First Search", "A* Pathfinder", "Dijkstra's Algorithm"];
export enum Algorithms {
    A_STAR = "A* Pathfinder",
    DIJKSTRA = "Dijkstra's Algorithm",
    BREADTH = "Breadth First Search",
    DEPTH = "Depth First Search"
}